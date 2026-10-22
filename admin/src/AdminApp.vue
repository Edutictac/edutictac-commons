<script setup>
import {watch,nextTick} from 'vue';
import {useAdmin} from './useAdmin.js';
const model=useAdmin();
const {t,language,authorized,checking,pending,loggingOut,canWrite,statusText,output,actionText,apiMessage,modules,selected,moduleManageable,modulesNotice,wizard,wizardOpen,closeWizard,teacher,teacherMessage,credential,clearTeacher,mount,mountDirty,restore,rollback,backups,rollbacks,secondary,secondaryText,job,pollState,trackingPaused,loadStatus,applyModules,createTeacher,checkUpdates,confirmed,backupCreate,typedAction,secondaryAction,operation,logout,login,resumeTracking}=model;
watch(wizardOpen,async value=>{await nextTick();if(value&&!wizard.value?.open)wizard.value?.showModal();else if(!value&&wizard.value?.open)wizard.value.close();});
</script>
<template>
    <header class="topbar">
      <div>
        <p class="eyebrow">EduTicTac Commons</p>
        <h1>{{ t("admin.title") }}</h1>
      </div>
      <div class="topbar-actions">
        <span id="apiStatus" class="status" role="status">{{ t(apiMessage) }}</span>
        <div class="lang-switcher" role="group" aria-label="Idioma" :title="t('common.lang.label')">
          <button type="button" data-lang="ca" :class="{active:language==='ca'}" :aria-current="language==='ca'?'true':undefined" title="Català">CA</button>
          <button type="button" data-lang="va" :class="{active:language==='va'}" :aria-current="language==='va'?'true':undefined" title="Valencià">VA</button>
          <button type="button" data-lang="es" :class="{active:language==='es'}" :aria-current="language==='es'?'true':undefined" title="Español">ES</button>
          <button type="button" data-lang="en" :class="{active:language==='en'}" :aria-current="language==='en'?'true':undefined" title="English">EN</button>
        </div>
      </div>
    </header>

    <main class="single-layout">
      <section class="panel" aria-labelledby="loginTitle">
        <div class="panel-heading">
          <p class="eyebrow">{{ t("login.access") }}</p>
          <h2 id="loginTitle">{{ t("login.title") }}</h2>
        </div>
        <div class="actions">
          <button id="loginBtn" @click="login" :disabled="pending" type="button">{{ t("login.enter") }}</button>
          <button id="logoutBtn" @click="logout" :disabled="loggingOut" type="button" class="secondary">{{ t("login.logout") }}</button>
          <button id="refreshBtn" @click="loadStatus" :disabled="checking||pending" type="button" class="secondary">{{ t("login.refresh") }}</button>
        </div>
      </section>

      <section id="modulesPanel" class="panel" aria-labelledby="modulesTitle">
        <div class="panel-heading">
          <p class="eyebrow">{{ t("modules.label") }}</p>
          <h2 id="modulesTitle">{{ t("modules.title") }}</h2>
        </div>
        <div id="modulesFormHome">

        </div>
      </section>

      <section class="panel" aria-labelledby="teacherTitle">
        <div class="panel-heading">
          <p class="eyebrow">{{ t("teachers.label") }}</p>
          <h2 id="teacherTitle">{{ t("teachers.title") }}</h2>
        </div>
        <form id="teacherForm" @submit.prevent="createTeacher">
<fieldset :disabled="!canWrite" class="teacher-fields">
          <label>
            <span>{{ t("teachers.username") }}</span>
            <input id="teacherUsername" v-model="teacher.username" required autocomplete="off" pattern="[A-Za-z0-9][A-Za-z0-9._-]{2,149}">
          </label>
          <label>
            <span>{{ t("teachers.name") }}</span>
            <input id="teacherName" v-model="teacher.name" required autocomplete="name">
          </label>
          <label>
            <span>{{ t("teachers.email") }}</span>
            <input id="teacherEmail" v-model="teacher.email" type="email" autocomplete="email">
          </label>
          <div class="actions">
            <button type="submit">{{ t("teachers.create") }}</button>
          </div>
        </fieldset></form>
        <div id="teacherOutput" class="output" :class="{empty:!credential&&!teacherMessage,error:teacherMessage==='admin.teacherError'}" role="status">
{{ credential?t('teachers.created',{username:credential.username,password:credential.password}):t(teacherMessage||'teachers.help') }}
</div>
<button v-if="credential" id="clearTeacherCredential" class="secondary" @click="clearTeacher">{{ t('admin.clearCredential') }}</button>
      </section>

      <section class="panel" aria-labelledby="statusTitle">
        <div class="panel-heading">
          <p class="eyebrow">{{ t("status.label") }}</p>
          <h2 id="statusTitle">{{ t("status.title") }}</h2>
        </div>
        <div id="statusOutput" class="output" :class="{empty:!authorized}">{{ statusText }}</div>
      </section>

      <section class="panel" aria-labelledby="actionsTitle">
        <div class="panel-heading">
          <p class="eyebrow">{{ t("common.actions") }}</p>
          <h2 id="actionsTitle">{{ t("backup.title") }}</h2>
        </div>
        <div class="actions">
          <button id="backupCreateBtn" @click="backupCreate" :disabled="!canWrite" type="button">{{ t("backup.create") }}</button>
          <button id="timerInstallBtn" @click="confirmed('/api/backup-timer/install','backup.installTimerConfirm')" :disabled="!canWrite" type="button">{{ t("backup.installTimer") }}</button>
          <button id="timerUninstallBtn" @click="confirmed('/api/backup-timer/uninstall','backup.uninstallTimerConfirm')" :disabled="!canWrite" type="button" class="secondary">{{ t("backup.uninstallTimer") }}</button>
        </div>
        <form id="secondaryForm" @submit.prevent="secondaryAction('configure')">
          <fieldset id="secondaryControls" :disabled="!canWrite">
            <legend>{{ t("secondary.title") }}</legend>
            <p class="hint">{{ t("secondary.help") }}</p>
            <label for="secondaryMount">{{ t("secondary.mount") }}</label>
            <input id="secondaryMount" v-model="mount" @input="mountDirty=true" type="text" placeholder="/media/commons-backup" autocomplete="off" maxlength="1024" required>
            <p class="hint">{{ t("secondary.mounted") }}</p>
            <div class="actions">
              <button id="secondarySave" type="submit">{{ t("secondary.save") }}</button>
              <button id="secondaryCopy" @click="secondaryAction('copy')" :disabled="!canWrite||!secondary.enabled" type="button" class="secondary">{{ t("secondary.copy") }}</button>
              <button id="secondaryDisable" @click="secondaryAction('disable')" :disabled="!canWrite||!secondary.enabled" type="button" class="secondary">{{ t("secondary.disable") }}</button>
            </div>
          </fieldset>
          <p id="secondaryStatus" role="status" aria-live="polite">{{ secondaryText }}</p>
        </form>
        <label>
          <span>{{ t("backup.restoreLabel") }}</span>
          <select id="restoreBackupSelect" v-model="restore" :disabled="!canWrite||!backups.length"><option v-if="!backups.length" value="">{{ t('backup.noneAvailable') }}</option><option v-for="backup in backups" :key="backup.name" :value="backup.name">{{backup.name}} ({{backup.created_at||t('backup.noDate')}})</option></select>
        </label>
        <div class="actions">
          <button id="backupRestoreBtn" @click="typedAction('restore')" :disabled="!canWrite||!restore" type="button" class="danger">{{ t("backup.restore") }}</button>
        </div>
        <div class="panel-heading compact">
          <p class="eyebrow">{{ t("images.label") }}</p>
          <h2>{{ t("images.title") }}</h2>
        </div>
        <div class="actions">
          <button id="imagesCheckBtn" @click="checkUpdates" :disabled="!canWrite" type="button" class="secondary">{{ t("images.check") }}</button>
          <button id="imagesUpdateBtn" @click="typedAction('update')" :disabled="!canWrite" type="button" class="danger">{{ t("images.update") }}</button>
        </div>
        <label>
          <span>{{ t("images.rollbackLabel") }}</span>
          <select id="rollbackBackupSelect" v-model="rollback" :disabled="!canWrite||!rollbacks.length"><option v-if="!rollbacks.length" value="">{{t('images.rollbackNone')}}</option><option v-for="backup in rollbacks" :key="backup.name" :value="backup.name">{{backup.name}} (→ {{backup.update.previous_image_tag}})</option></select>
        </label>
        <div class="actions">
          <button id="imagesRollbackBtn" @click="typedAction('rollback')" :disabled="!canWrite||!rollback" type="button" class="danger">{{ t("images.rollback") }}</button>
        </div>
        <div class="panel-heading compact">
          <p class="eyebrow">{{ t("content.label") }}</p>
          <h2>{{ t("content.title") }}</h2>
        </div>
        <p class="hint">{{ t("content.help") }}</p>
        <div class="actions">
          <button id="contentResourcesSyncBtn" @click="operation('/api/content-sync/resources')" :disabled="!canWrite" type="button" class="secondary">{{ t("content.resources") }}</button>
          <button id="contentEduhootSyncBtn" @click="operation('/api/content-sync/eduhoot')" :disabled="!canWrite" type="button" class="secondary">{{ t("content.eduhoot") }}</button>
        </div>
        <div id="actionOutput" class="output" :class="{empty:output.key==='common.actionPlaceholder',error:output.error}" role="status">{{ actionText }}</div>
<div v-if="job" id="jobTracking" :data-state="pollState" role="status">{{ t('admin.tracking') }}<button v-if="trackingPaused" id="jobResume" class="secondary" @click="resumeTracking">{{ t('admin.resumeTracking') }}</button></div>
      </section>
    </main>

    <dialog ref="wizard" id="modulesWizard" @cancel.prevent="closeWizard" aria-labelledby="modulesWizardTitle">
      <div class="lang-switcher" role="group" aria-label="Idioma">
        <button type="button" data-lang="ca" :class="{active:language==='ca'}" :aria-current="language==='ca'?'true':undefined">CA</button>
        <button type="button" data-lang="va" :class="{active:language==='va'}" :aria-current="language==='va'?'true':undefined">VA</button>
        <button type="button" data-lang="es" :class="{active:language==='es'}" :aria-current="language==='es'?'true':undefined">ES</button>
        <button type="button" data-lang="en" :class="{active:language==='en'}" :aria-current="language==='en'?'true':undefined">EN</button>
      </div>
      <h2 id="modulesWizardTitle">{{ t("modules.firstTitle") }}</h2>
      <div id="modulesWizardContent"></div>
    </dialog>

<Teleport :to="wizardOpen?'#modulesWizardContent':'#modulesFormHome'">
          <form id="modulesForm" @submit.prevent="applyModules">
            <p>{{ t("modules.core") }}</p>
            <fieldset id="modulesChoices" :disabled="!canWrite||!moduleManageable">
              <legend>{{ t("modules.choose") }}</legend>
              <label class="module-choice"><input type="checkbox" name="module" v-model="selected" value="play"><span><strong>EduTicTac Play</strong><small>{{ t("modules.play") }}</small></span></label>
              <label class="module-choice"><input type="checkbox" name="module" v-model="selected" value="eduhoot"><span><strong>EduHoot</strong><small>{{ t("modules.eduhoot") }}</small></span></label>
              <label class="module-choice"><input type="checkbox" name="module" v-model="selected" value="recursos"><span><strong>{{ t("modules.resourcesName") }}</strong><small>{{ t("modules.recursos") }}</small></span></label>
              <label class="module-choice"><input type="checkbox" name="module" v-model="selected" value="quiosc" :disabled="!modules?.available?.quiosc&&!selected.includes('quiosc')"><span><strong>EduTicTac Quiosc</strong><small>{{ t("modules.quiosc") }}</small></span></label>
            </fieldset>
            <p id="modulesQuioscHint" :hidden="Boolean(modules?.available?.quiosc)" class="hint">{{ t("modules.quioscPreparation") }}</p>
            <p class="hint">{{ t("modules.retention") }}</p>
            <p id="modulesNotice" role="status" aria-live="polite">{{ modulesNotice }}</p>
            <div class="actions">
              <button id="modulesApply" type="submit" :disabled="!canWrite||!moduleManageable">{{ t("modules.apply") }}</button>
              <button id="modulesLater" type="button" class="secondary" :hidden="!wizardOpen" @click="closeWizard">{{ t("modules.later") }}</button>
            </div>
          </form>
</Teleport>
</template>
