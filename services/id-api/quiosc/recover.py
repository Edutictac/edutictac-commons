"""Administrative recovery through Epoptes, independent of either web browser.

Run inside id-api: python -m quiosc.recover SESSION_ID [--device PC_ID]
The OS/container administrator is the authority here; all results are audited.
"""
import argparse
import json
import sys

from .service import Quiosc


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('session_id')
    parser.add_argument('--device')
    args = parser.parse_args()
    service = Quiosc()
    if not service.session(args.session_id):
        parser.error('Sesión desconocida')
    try:
        result = service.operate(args.session_id, 'local-administrator', 'stop', args.device)
    except Exception:
        print('No se pudo confirmar la recuperación. Revisa la conexión Epoptes.', file=sys.stderr)
        return 1
    # Do not emit MAC, URL, credential, process command line or user identities.
    for device in result['devices']:
        print(json.dumps({'device': device['id'], 'state': device['state']}, ensure_ascii=False))
    return 0 if all(d['state'] in ('finished', 'simulation_finished') for d in result['devices']
                    if not args.device or d['id'] == args.device) else 1


if __name__ == '__main__':
    raise SystemExit(main())
