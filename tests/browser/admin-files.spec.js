const {test,expect}=require('@playwright/test');
test('administració: guardar límits, validar quotes i traduir sense perdre valors',async({page})=>{
 let settings={max_file_bytes:50*1048576,group_quota_bytes:500*1048576,student_quota_bytes:50*1048576,students_can_upload:true},saved=[];
 await page.addInitScript(()=>localStorage.setItem('edutictac-admin-lang','va'));
 await page.route('**/api/**',route=>{
  const p=new URL(route.request().url()).pathname;
  if(p==='/admin/api/status')return route.fulfill({json:{backups:[],active_profiles:[],services:{},backup_timer:{},stack_version:'test'}});
  if(p==='/admin/api/modules')return route.fulfill({json:{configured:true,enabled:[],revision:'1'.repeat(64),phase:'idle',manageable:true}});
  if(p==='/api/admin/files/settings'){
   if(route.request().method()==='PUT'){settings=route.request().postDataJSON();saved.push(settings);}
   return route.fulfill({json:{settings,usage:{files:2,total_bytes:512},disk_free_bytes:1048576000}});
  }
  return route.fulfill({status:401,json:{error:'unauthorized'}});
 });
 await page.goto('/admin/');await expect(page.locator('#modulesApply')).toBeEnabled();
 await page.locator('[data-files-settings] summary').click();await expect(page.locator('[data-files-max]')).toHaveValue('50');
 await page.locator('[data-files-group]').fill('10');await page.locator('[data-files-settings-save]').click();
 await expect(page.locator('[data-files-settings-feedback]')).toContainText('quota');expect(saved).toHaveLength(0);
 await page.locator('[data-files-group]').fill('600');await page.locator('[data-files-max]').fill('60');await page.locator('[data-files-upload]').uncheck();await page.locator('[data-files-settings-save]').click();
 await expect(page.locator('[data-files-settings-feedback]')).toContainText('guardats');expect(saved).toEqual([{max_file_bytes:60*1048576,group_quota_bytes:600*1048576,student_quota_bytes:50*1048576,students_can_upload:false}]);
 await page.locator('header [data-lang=es]').click();await expect(page.locator('[data-files-settings] summary')).toHaveText('Archivos del aula');await expect(page.locator('[data-files-max]')).toHaveValue('60');
});
