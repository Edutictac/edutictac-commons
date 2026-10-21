#!/usr/bin/env python3
"""Real Blocs/Rebost integration in disposable offline containers.

Reuses the existing Commons test harness and synthetic classroom code/PIN.
Creates no accounts or content in the installed stack. Llibres' complementary
acceptance suite lives in its own tests/test_rebost*. Requirements: Docker,
Playwright, Chromium, Pillow and the sibling Blocs build.
"""
import importlib.util
from pathlib import Path
from playwright.sync_api import expect

def scenario(browser, base, language, touch):
    es = language == 'es'
    context = browser.new_context(has_touch=touch, viewport={'width':1280, 'height':1000})
    assert context.request.post(base + '/api/auth/student', data={'public_code':'ABC', 'pin':'1234'}).status == 200
    context.add_init_script(f"localStorage.setItem('tw:language','{language}');localStorage.setItem('edutictac-portal-lang','{'es' if es else 'va'}');")
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base + '/') or route.request.url.startswith(('blob:', 'data:')) else route.abort())
    page.goto(base + '/blocs/editor.html', wait_until='domcontentloaded')
    page.wait_for_function('window.vm && vm.runtime.targets.length', timeout=90000)
    label = 'Elegir del Rebost' if es else 'Tria del Rebost'

    def picker(background=False):
        menu = page.locator('[class*="stage-selector_add-button"]' if background else '[class*="sprite-selector_add-button"]')
        main = menu.locator('[class*="main-button"]')
        if touch:
            main.tap()
        else:
            main.hover()
        menu.get_by_role('button', name=label, exact=True).click()
        frame = page.frame_locator('iframe[title="' + label + '"]')
        expect(frame.locator('#grid > article').first).to_be_visible()
        return frame

    frame = picker()
    frame.locator('#scratchTab').click()
    frame.locator('#search').fill('scratch-bat')
    expect(frame.locator('#grid > article')).to_have_count(1)
    frame.get_by_role('button', name='Añadir personaje con disfraces' if es else 'Afegir personatge amb disfresses', exact=True).click()
    page.wait_for_function('vm.runtime.targets.some(t=>["Murciélago","Ratpenat"].includes(t.getName()) && t.getCostumes().length===4)')
    assert page.evaluate('''() => {
      const target = vm.runtime.targets.find(t => ['Murciélago','Ratpenat'].includes(t.getName()));
      vm.runtime._primitives.motion_movesteps({STEPS: 40}, {target});
      const previous = target.currentCostume;
      vm.runtime._primitives.looks_nextcostume({}, {target});
      return target.x === 40 && target.currentCostume !== previous;
    }''')
    frame = picker(True)
    frame.locator('#search').fill('Bosque' if es else 'Bosc')
    expect(frame.locator('#grid > article')).to_have_count(1)
    frame.get_by_role('button', name='Usar en el proyecto' if es else 'Usa en el projecte', exact=True).click()
    page.wait_for_function('vm.runtime.getTargetForStage().getCostumes().some(c=>["Bosque","Bosc"].includes(c.name))')
    assert page.evaluate("vm.runtime.getTargetForStage().getCostumes().some(c=>['Bosque','Bosc'].includes(c.name) && c.dataFormat==='png')")
    page.screenshot(path=str(Path('/tmp') / f'rebost-vue-blocs-{language}.png'))
    assert not errors, errors
    context.close()
    print(f'Blocs + central Rebost: {language}, touch={touch}: OK')


if __name__ == '__main__':
    spec = importlib.util.spec_from_file_location('rebost_harness', Path(__file__).with_name('verify-rebost-commons.py'))
    harness = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(harness)
    harness.scenario = scenario
    harness.main()
