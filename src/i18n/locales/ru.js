import palette from '../../styles/palette';
import {rocketIcon} from '../../components/tutorials/tutor';

export const ru = {
  header: {
    telegramChat: `Telegram чат`,
    authorizerBot: `Authorizer bot`,
    text2Speech: `Text 2 Speech`,
    creativeSociety: `Созидательное Общество`,
    welcomeTutor: `Запустить туториал`,
  },
  loading: `Загрузка...`,
  mobileIsNotSupported: `Мобильные устройства не поддерживаются. Пожалуйста, используйте компьютер.`,
  showGuide: `Короткая инструкция`,
  modals: {
    preset: {
      addPreset: `Сохранить Пресет`,
      addVoicePreset: `Пресет Голоса`,
      addedInfo: `Добавлено: <s> {{lastAddedPreset}} </s>`,
      basePitch: `Тон голоса`,
      baseSpeed: `Скорость`,
      baseVolume: `Громкость`,
      credentials: `Ключи`,
      extraAccInputs: `Доп. точность значений`,
      generateSampleSpeech: `Сгенерировать образец`,
      language: `Язык`,
      previewNotSupported: `Предпросмотр недоступен`,
      style: `Стилизация`,
      styleDegree: `Интенсивность стилизации`,
      voice: `Голос озвучки`,
      voicingService: `Сервис озвучки`,
    },
  },
  tabs: {
    audioMixer: {
      master: `Мастер`,
      original: `Оригинал`,
      title: `Микшер звука`,
    },
    export: {
      codec: `Кодек`,
      currentDate: `Текущая дата`,
      currentTime: `Текущее время`,
      exportAs: `Экспортировать как`,
      exportFileFailed: `Ошибка экспорта файла`,
      exportFileSucceeded: `Файл "<bold>{{fileName}}</bold>" успешно экспортирован`,
      exportFormat: `Формат экспорта`,
      format: `Формат`,
      speaker: `Cпикер`,
      speakerLanguage: `Язык спикера`,
      speakerName: `Имя спикера`,
      title: `Экспорт`,
    },
    general: {
      title: `Инструменты и перевод`,
      interfaceLanguage: `Язык интерфейса`,
      playbackSpeed: `Скорость воспроизведения`,
      showNote: `Отображать заметки`,
      autoTranslateNote: `Автоматически переводить субтитры в заметках`,
      translateSourceLang: `Перводить с`,
      translateTargetLang: `Переводить на`,
      refreshTranslations: `Обновить переводы`,
      speakAll: `Озвучить все субтитры для выделенного спикера`,
    },
    import: {
      importVideo: `Импортировать аудио или видео`,
      resetAll: `Сбросить всё`,
      resetSubtitlesOnly: `Сбросить только субтитры`,
      resetWarning: `Если вы действительно хотите сбросить весь свой прогресс навсегда, нажмите кнопку ещё {{resetCountdown}} раз(а)`,
      restoreFromBackupFile: `Восстановить из бекап файла`,
      saveBackupFile: `Сохранить бекап`,
      title: `Импорт`,
      videoImportError: `Не удалось открыть этот формат видео`,
    },
    markers: {
      color: `Цвет`,
      title: `Маркеры`,
      description: `Нажмите «M» («Ь») чтобы добавить или убрать маркер`,
    },
    presets: {
      pressToAddCredentials: `Нажмите «+» чтобы добавить ключи`,
      title: `Мои голоса`,
      voicingBots: `Боты озвучки`,
    },
    speakers: {
      color: `Цвет`,
      speakerPreset: `Голос`,
      title: `Спикеры`,
    },
    subtitles: {
      title: `Субтитры`,
    },
    hotkeysAndHelp: {
      titleHotkeys: `Горячие клавиши`,
      titleSupport: `Помощь`,
    },
  },
  timeline: {
    originalAudio: `Оригинальный звук`,
  },
  tutors: {
    welcome: {
      steps: {
        authorizerBot: `<h4>Важно! Только для волонтеров <code>Созидательного Общества</code>!</h4>
Прежде всего вам необходимо получить временный ключ доступа 🔑, чтобы иметь бесплатный доступ к сервису. Перейдите в <a href="https://t.me/voicerstudio_bot">@voicerstudio_bot</a> и следуйте инструкции, чтобы получить ваш ключ.`,
        authorizerBotNext: `Если у вас уже есть ключ доступа или вы хотите использовать напрямую ключи доступа сервиса озвучки, вам необходимо указать их на этой вкладке.
<hr/>А пока продолжим обзор интерфейса :)`,
        speakersTab: `Во вкладке <code>Speakers</code> можете добавлять новых спикеров и присваивать им голоса ботов.`,
        mixerTab: `Во вкладке <code>Mixer</code> можете управлять громкостью воспроизведения оригинального аудиоряда и озвучек спикеров.`,
        markersTab: `Чтобы добавить или убрать маркер воспользуйтесь клавишей <code>M</code>. Просмотреть список маркеров, а так же поменять их цвет и текст – можете на вкладке <code>Markers</code>.`,
        importAndBackupTab: `Чтобы начать работу с оригинальным видео или аудио, перейдите на вкладку <code>Import and Backup</code>
<hr/>Там же можете экспортировать проект в виде бекап-файла или восстановить его из бекап-файла. Бекапы можно использовать, чтобы передать проект кому-то другому или чтобы продолжить работу на другом устройстве или браузере.
<br/><i>ВАЖНО. Передавать нужно И бекап-файл И оригинальный файл (видео или аудио), который вы загружали ранее!</i>`,
        exportTab: `<h5>Алгоритм когда вы завершили работу и необходимо вывести результат</h5>
<ul>
  <li>Перейдите на вкладку <code>Export</code></li>
  <li>Выберите спикера, озвучку для которого хотите экспортировать</li>
  <li>Укажите формат имени файла для экспорта. По умолчанию <code>{L}_{s}_{d}-{t}</code> (на выходе файл в таком случае будет называться <code>ENG_Tatyana_2023-11-30-23-59</code>)</li>
  <li>Нажмите <code>Экспортировать как WAV</code></li>
</ul>`,
        magnetModeBtn: `Включите магнит 🧲, чтобы субтитры автоматически прилипали к маркерам и к другим субтитрам.`,
        playPause: `Используйте кнопку <code>Play/Pause ▶</code>, чтобы начать или остановить воспроизведение. Также вы можете использовать клавишу <code>ПРОБЕЛ</code> на клавиатуре.`,
        recordBtn: `Чтобы записать новый субтитр, нажмите кнопку <code>🔴 REC</code> или удерживайте клавишу <code>R</code>️.
<hr/>Если вы хотите быстро создать пустой субтитр, просто нажмите кнопку <code>R</code> (не удерживая ее).`,
        timelineGeneral: `Это таймлайн. Здесь вы можете добавлять, редактировать и слушать свои субтитры.`,
        timelineCursor: `Это курсор, который показывает текущее время, что проигрывается на таймлайне. Если вы создаете новый субтитр, то он будет добавляться там, где в данный момент находится курсор.
<hr/><i>P.S. Так же курсор можно называть бегунок или на умном – плейхэд</i>`,
        timelineInteract: `Чтобы переместить курсор, щелкните где-нибудь внутри этой области.`,
        timelineProgress: `Так же вы можете использовать глобальную навигацию по всему материалу, кликая в этой области.
<hr/>В том числе тут будет отображаться "мини-карта" всех субтитров на таймлайне.`,
        hotkeysAndHelp: `Откройте вкладку <code>Hotkeys & Help</code>, чтобы увидеть список доступных горячих клавиш. Они сделают вашу работу намного быстрее 😉️️️️️️`,
        supportChat: `Не бойтесь переходить в чат поддержки, если у вас возникнут вопросы или проблемы 💖️️️️️️`,
        nextSteps: `Мы рекомендуем начать работу с вкладки <code>Voicing Bots</code>.
<hr/><h5>Алгоритм начала работы примерно следующий</h5>
<ul>
  <li>На вкладке <code>Import and Backup</code> загрузить оригинальное видео или аудио <b>(разрешение должно быть НЕ БОЛЬШЕ чем HD 720 для корректной работы)</b></li>
  <li>Если вам передали готовый проект, на этой же вкладке укажите бекап</li>
  <li>Добавить на вкладке <code>Voicing Bots</code> ключики доступа (которые вы должны получили через телеграмм-бота)</li>
  <li>Добавить на этой же вкладке голоса ботов</li>
  <li>На вкладке <code>Speakers</code> добавить спикеров и присвоить им голоса ботов, которые добавили ранее</li>
</ul>
`,
      },
    },
    subtitles: {
      steps: {
        subText: `Это поле для ввода текста на озвучку. Весь текст, что в нем указан будет напрямую отправлен боту на озвучку.
<hr/><h5>Горячие клавиши</h5>
Чтобы разбить субтитр на 2 части установите курсор в месте, где хотите сделать разрыв и нажмите <code>Enter</code>.
<br/>Чтобы отменить предыдущее действие, уберите фокус с текстового поля (кликните в любом пустом месте) и нажмите <code>Ctrl+Z (Cmd+Z)</code>`,
        subNote: `Справа от поля для текста есть отдельное место для заметок.
<br/><i>Оно исключительно удобства, сюда можно записывать что-угодно. Так же можно использовать автоматический перевод субтитра, тогда перевод на ваш язык будет отображаться в заметках.<i/>`,
        openConfigurationToToggleNotes: `Если у вас не отображаются заметки или вы хотите их скрыть, перейдите во вкладку <code>Configuration</code>.
<br/>Там же вы можете настроить автоматический перевод субтитров.`,
        translateAllButton: `Чтобы вручную обновить переводы субтитров, используйте кнопку <code>Обновить переводы</code>.`,
        subStartEndTime: `Сверху в каждом субтитре отображается время начала и конца его воспроизведения.
<hr/>Формат <code>00:00:00,000</code> можно расшифровать как <code>час:минуты:секунды,миллисекунды</code>`,
        subDuration: `Далее в субтитре отображается его продолжительность в секундах.`,
        subAcceleration: `После озвучки субтитра в поле <code>Ускорение</code> будет отображаться на сколько процентов % субтитр был ускорен или замедлен относительно оригинальной скорости бота настроенной в голосе бота.
<hr/>То есть, если в голосе было указано ускорение 5%, то оно здесь не будет учитываться и будет показываться как 0% ускорения. Но если вы дополнительно ускорите или замедлите субтитр, это будет отображаться здесь.
<hr/><b>-20%</b> – если значение меньше 0, значит субтитр ускорено (его длительность уменьшена на 5%)
<br/><b>+20%</b> – если больше 0, значит субтитр замедлено (его длительность увеличена на 5%)
<hr/><b>Значение не может быть больше 20% и меньше -20%</b>, но <code>рекомендуется НЕ выходить за рамки +-12%, чтобы не искажался голос!</code>`,
        subDownload: `Чтобы быстро скачать озвучку для выбранного субтитра можно воспользоваться кнопкой <code>Загрузка</code>`,
        subSpeak: `Чтобы сделать озвучку голосом бота для конкретного субтитра – воспользуйтесь кнопкой <code>Озвучка ботом</code>
<hr/><h5>Статусы озвучки</h5>
<br/>${rocketIcon(palette.statusColors.none)} – субтитр ещё не озвучен ботом
<br/>${rocketIcon(palette.statusColors.warn)} – идет озвучка
<br/>${rocketIcon(palette.statusColors.ok)} – субтитр озвучен ботом (для работы в программе, для экспорта НЕТ необходимости его озвучивать, так как для экспорта субтитры озвучиваются всегда заново!!!)
<br/>${rocketIcon(palette.statusColors.danger)} – субтитр озвучен, но текст был изменен и озвучка уже не актуальна`,
        speakAll: `<b>Но НЕ рекомендую озвучивать все субтитры по отдельности!!!</b>
<hr/>Удобнее использовать кнопку <code>Озвучить все субтитры для ВЫДЕЛЕННОГО спикера</code> или сочетание клавиш <code>Ctrl+G (Cmd+G)</code>`,
        subResetSpeed: `Чтобы отменить ускорение (замедление) субтитра и сбросить ускорение до 0%, можно использовать кнопку <code>Сбросить ускорение</code>`,
      },
    },
  },
};
