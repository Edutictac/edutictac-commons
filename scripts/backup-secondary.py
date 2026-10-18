#!/usr/bin/env python3
"""Configure or retry the optional second backup on the host."""
import argparse
import importlib.util
import os
from pathlib import Path
import sys

from backup_secondary import Secondary, SecondaryError


def main():
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument('action', choices=['configure', 'disable', 'copy'])
    parser.add_argument('--mount', default='')
    args = parser.parse_args()
    secondary = Secondary(args.root.resolve() / 'backups')
    with secondary.locked():
        if args.action == 'configure':
            secondary.configure(args.mount)
        elif args.action == 'disable':
            secondary.disable()
        else:
            spec = importlib.util.spec_from_file_location('backup_stack', Path(__file__).with_name('backup-stack.py'))
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            stack = module.Stack(args.root)
            with stack.locks():
                if secondary.copy(stack.latest(), stack.validate) == 'disabled':
                    raise SecondaryError('disabled')
    print('secondary: ' + args.action + '_completed')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('secondary: ' + (str(error) if isinstance(error, SecondaryError) else 'operation_failed'), file=sys.stderr)
        sys.exit(1)
