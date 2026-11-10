import type { Answer } from "@/content/answer-types";

// Факты — specs/research/wiki-life.md, разделы 4 и 5 (проверены 2026-11-10).
// Не выносим: статус VK, Яндекса и «Госуслуг» из Китая, Instagram (источник 2016 года), практику применения норм о VPN к студентам.
// Инструкций по обходу блокировок и названий VPN-сервисов не даём.
export const internet: Answer = {
  path: "/wiki/internet/",
  crumb: "Связь и интернет",
  zh: "网络",
  eyebrow: "SIM-карта, тарифы, блокировки",
  h1: "Связь и интернет в Китае:",
  h1Accent: "SIM-карта и что заблокировано",
  metaTitle: "Связь и интернет в Китае для студента: SIM-карта и блокировки",
  metaDescription: "Как студенту купить SIM-карту в Китае, сколько стоит студенческий тариф, какие сайты и мессенджеры заблокированы и что говорят правила о каналах выхода в сеть.",
  answer:
    "В Китае четыре оператора связи: China Mobile, China Unicom, China Telecom и China Broadnet. SIM-карту покупают лично в офисе оператора по паспорту — регистрация по паспорту обязательна. Студенческий тариф China Mobile в Нанкине стоит 40 юаней в месяц за 20 ГБ и 300 минут. Google, Facebook, Twitter, WhatsApp, Telegram и Signal в Китае заблокированы. По правилам Китая, выходить в зарубежный интернет можно только через государственные каналы. За нарушение полиция может оштрафовать до 15 000 юаней.",
  updated: "2026-11-10",
  facts: [
    { label: "Операторы", value: "4", note: "China Mobile, Unicom, Telecom, Broadnet", src: 1 },
    { label: "Студенческий тариф", value: "40–60 ¥", note: "в месяц, пример Hohai University и China Mobile", src: 3 },
    { label: "Штраф", value: "до 15 000 ¥", note: "за другие каналы выхода в зарубежную сеть, ст. 14 Указа № 195", src: 7 },
  ],
  sections: [
    {
      id: "sim",
      eyebrow: "SIM-карта",
      title: "Как получить",
      accent: "китайский номер",
      paragraphs: [
        "Китайский номер нужен с первых дней. Например, без него не открыть счёт в банке: банк присылает коды по SMS.",
        "SIM-карту оформляют лично в офисе оператора, с паспортом. Регистрация по паспорту обязательна. Власти Шанхая и района Лунган в Шэньчжэне советуют не покупать SIM через онлайн-посредников.",
      ],
      steps: [
        { title: "Возьмите паспорт", text: "Без паспорта номер не оформят: SIM-карта регистрируется на владельца." },
        { title: "Придите в офис оператора", text: "China Mobile, China Unicom, China Telecom или China Broadnet." },
        { title: "Спросите студенческий тариф", text: "У операторов бывают тарифы для студентов конкретных вузов. Пример — ниже." },
      ],
      src: [1, 2, 15],
    },
    {
      id: "plans",
      eyebrow: "Тарифы",
      title: "Сколько стоит",
      accent: "связь",
      paragraphs: [
        "Пример — студенческие тарифы China Mobile для Hohai University. В кампусе в Чанчжоу тариф стоит 48 юаней: 70 ГБ и 300 минут.",
        "Кампус Пекинского университета в Шэньчжэне закладывает на связь 30 юаней в месяц. По Numbeo, обычный тариф с 10 ГБ и больше стоит 66 юаней в Пекине, 54 — в Шанхае и 83,5 — в Чэнду.",
      ],
      table: {
        caption: "Студенческие тарифы China Mobile, Hohai University, Нанкин",
        head: ["Цена в месяц", "Интернет", "Минуты"],
        rows: [
          ["40 юаней", "20 ГБ", "300"],
          ["60 юаней", "80 ГБ: 30 по Китаю + 50 в кампусе", "500"],
        ],
        src: [3],
      },
      src: [3, 4, 5, 9, 6],
    },
    {
      id: "blocked",
      eyebrow: "Блокировки",
      title: "Что не открывается",
      accent: "в Китае",
      paragraphs: [
        "Многие зарубежные сайты и приложения в Китае заблокированы. Freedom House в отчёте за июнь 2024 — май 2025 года пишет о блокировке соцсетей и «тысяч доменов».",
      ],
      list: [
        "Поиск и сервисы Google.",
        "Facebook и Twitter.",
        "Мессенджеры WhatsApp, Telegram и Signal.",
        "YouTube — по данным 2016 года.",
      ],
      src: [10, 11, 12],
    },
    {
      id: "law",
      eyebrow: "Правила",
      title: "Что говорит",
      accent: "закон",
      paragraphs: [
        "Главная норма — Временные положения о международном подключении компьютерных сетей (Указ Госсовета № 195 от 1 февраля 1996 года, редакция 20 мая 1997 года). Статья 6: выходить в зарубежную сеть можно только через каналы государственной сети. Никакие организации и частные лица не вправе создавать или использовать другие каналы.",
        "Статья 14: полиция требует прекратить такое подключение и выносит предупреждение. Может оштрафовать до 15 000 юаней. Незаконный доход конфискуют.",
        "В январе 2017 года Министерство промышленности и информатизации (MIIT) выпустило уведомление: без разрешения MIIT нельзя создавать или арендовать каналы, включая VPN, для трансграничной деятельности. Законны только VPN лицензированных операторов связи.",
        "Как эти нормы применяют к иностранным студентам на практике, официальные источники не сообщают.",
      ],
      src: [7, 8],
    },
    {
      id: "russian",
      eyebrow: "Российские сервисы",
      title: "Российские приложения",
      accent: "и VPN",
      paragraphs: [
        "С апреля 2026 года приложения Яндекса (Погода, Почта, Кинопоиск, Пэй), Ozon и Wildberries не открываются с включённым VPN. Компании ссылаются на требование регулятора.",
        "Эти сообщения касаются пользователей в России. Действует ли ограничение для тех, кто живёт за рубежом, не подтверждено. Проверьте нужные приложения — банк, почту, «Госуслуги» — до отъезда.",
      ],
      src: [13, 14],
    },
  ],
  faq: [
    { q: "Где купить SIM-карту в Китае?", a: "В офисе оператора: China Mobile, China Unicom, China Telecom или China Broadnet. Нужен паспорт, регистрация по нему обязательна." },
    { q: "Сколько стоит мобильная связь для студента?", a: "Пример — студенческие тарифы China Mobile в Hohai University. 40 юаней в месяц: 20 ГБ и 300 минут. 60 юаней: 80 ГБ и 500 минут." },
    { q: "Работает ли в Китае Telegram?", a: "Нет. Telegram, WhatsApp и Signal в Китае заблокированы, как и Google, Facebook и Twitter." },
    { q: "Законен ли VPN в Китае?", a: "По уведомлению MIIT 2017 года законны только VPN лицензированных операторов связи. Указ Госсовета № 195 запрещает организациям и частным лицам использовать другие каналы выхода в зарубежную сеть. Штраф — до 15 000 юаней." },
    { q: "Откроются ли Яндекс и Ozon из Китая?", a: "Официальных данных нет. Известно, что с апреля 2026 года эти приложения не открываются с включённым VPN у пользователей в России. Проверьте нужные сервисы до отъезда." },
  ],
  sources: [
    { title: "Mobile phone and SIM card — Study in Shanghai", url: "https://english.shanghai.gov.cn/en-Editor'sPick-StudyinShanghai/20240920/3cf6d0fde1294ed18e9b0c82dd756d6a.html" },
    { title: "Useful information — Longgang District, Shenzhen", url: "https://www.lg.gov.cn/english/services/usefulInfo/content/post_11229336.html" },
    { title: "Студенческие тарифы — Hohai University", url: "https://ie.hhu.edu.cn/16310/list.htm" },
    { title: "Costs & Scholarships — Peking University Shenzhen", url: "https://english.pkusz.edu.cn/Admissions/Costs___Scholarships.htm" },
    { title: "Cost of living in Beijing — Numbeo", url: "https://www.numbeo.com/cost-of-living/in/Beijing" },
    { title: "Cost of living in Chengdu — Numbeo", url: "https://www.numbeo.com/cost-of-living/in/Chengdu" },
    { title: "Указ Госсовета КНР № 195 — CAC", url: "https://www.cac.gov.cn/1996-02/02/c_126468621.htm" },
    { title: "VPN compliance in China — Law.asia", url: "https://law.asia/vpn-compliance-china/" },
    { title: "Shanghai vs Beijing — Numbeo", url: "https://www.numbeo.com/cost-of-living/compare_cities.jsp?country1=China&city1=Shanghai&country2=China&city2=Beijing" },
    { title: "Signal joins blocked apps — South China Morning Post", url: "https://www.scmp.com/print/tech/policy/article/3125694/chinas-great-firewall-ensnares-encrypted-messaging-app-signal-joining" },
    { title: "Какие сервисы не работают в Китае — iPhones.ru", url: "https://www.iphones.ru/iNotes/527616" },
    { title: "Freedom on the Net 2025: China — Freedom House", url: "https://freedomhouse.org/country/china/freedom-net/2025" },
    { title: "Сервисы блокируют вход через VPN — Код Дурова", url: "https://kod.ru/servisy-cherez-vpn-block" },
    { title: "Яндекс начал блокировать свои приложения — Лайфхакер", url: "https://lifehacker.ru/yandeks-nachal-blokirovat-svoi-prilozheniya/" },
    { title: "Банковский счёт для иностранных студентов — China Pharmaceutical University", url: "https://international.cpu.edu.cn/4c/cc/c376a85196/page.htm" },
  ],
  related: [
    { href: "/wiki/rules-for-foreigners/", label: "Правила для иностранцев" },
    { href: "/wiki/payments/", label: "Как платить в Китае" },
    { href: "/wiki/budget/", label: "Бюджет студента" },
  ],
};
