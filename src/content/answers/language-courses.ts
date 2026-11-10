import type { Answer } from "@/content/answer-types";

// Факты — specs/research/wiki-study.md, разделы 2, 6, 7 (проверены 2026-11-10). Единый лимит возраста и единый порог посещаемости для визы не подтверждены — на сайт не выносим.
export const languageCourses: Answer = {
  path: "/wiki/language-courses/",
  crumb: "Языковые курсы",
  zh: "语言",
  eyebrow: "Курсы китайского без диплома",
  h1: "Языковые курсы в Китае:",
  h1Accent: "часы, уровни, посещаемость и возраст",
  metaTitle: "Языковые курсы в Китае: часы в неделю, уровни, HSK, возраст",
  metaDescription: "Как устроены курсы китайского в вузах Китая: 20⁠–⁠30 часов в неделю, группы по 20 человек, тест на уровень, HSK за год, лимиты возраста и правила пропусков.",
  answer:
    "Языковые курсы в вузе Китая — это 20⁠–⁠30 академических часов китайского в неделю. Новички сдают тест на уровень, по нему распределяют в группу. Группа — около 20 человек. Курс идёт семестр или год, цена — например, 15 000 юаней за год в HUST. BJTU ставит цель сдать HSK 4 за год, но это цель, а не гарантия. Возраст ограничивает каждый вуз сам: встречаются лимиты 40, 50 и 60 лет. За пропуски предупреждают и отчисляют, а отчисление бьёт по визе.",
  updated: "2026-11-10",
  facts: [
    { label: "Нагрузка", value: "20⁠–⁠30 часов", note: "академических в неделю, час — 45 минут в HUST", src: [1, 3] },
    { label: "Группа", value: "≈ 20 человек", note: "в HUST", src: 1 },
    { label: "Цена, пример", value: "15 000 ¥", note: "за год в HUST, 7 500 ¥ за семестр", src: 1 },
    { label: "Возраст", value: "18–40 … 18–60", note: "лимит задаёт вуз", src: [3, 10] },
  ],
  sections: [
    {
      id: "hours",
      eyebrow: "Нагрузка",
      title: "Сколько часов",
      accent: "в неделю",
      paragraphs: [
        "Обычная программа — 20⁠–⁠22 академических часа в неделю. Интенсивная и подготовительная — 30 часов. В HUST академический час длится 45 минут. В SCNU обычная программа идёт по утрам с понедельника по пятницу.",
      ],
      table: {
        caption: "Нагрузка на языковых курсах, примеры вузов",
        head: ["Вуз", "Часов в неделю", "Уровней", "Цена"],
        rows: [
          ["HUST", "20 на уровнях A–E, 22 на F, 30 на G", "7 (A–G)", "7 500 ¥ за семестр, 15 000 ¥ за год"],
          ["BJTU", "22; подготовительная программа — 30", "6", "—"],
          ["SCNU", "20 (обычная), 30 (интенсив)", "6 (A–F)", "17 000 ¥ за год (обычная) + 420 ¥ сбор за заявку"],
        ],
        src: [1, 2, 3],
      },
      list: [
        "Семестр в BJTU — 16 недель, подготовительная программа — 18 недель.",
        "Hohai предлагает языковую подготовку на 1 год и краткие курсы от 2 недель до 3 месяцев.",
        "Короткий курс PKU — 4 недели по 20 часов в неделю. Уровня для начинающих с нуля там нет.",
      ],
      src: [2, 7, 6],
    },
    {
      id: "levels",
      eyebrow: "Уровни",
      title: "Тест на уровень",
      accent: "и группы",
      paragraphs: [
        "В HUST семь уровней: начальный (A–B), средний (C–E) и продвинутый (F–G). Новички сдают распределительный тест. По его итогам студента записывают в группу. Если группа не подходит, её можно сменить за неделю.",
        "В группе HUST около 20 человек.",
      ],
      src: [1],
    },
    {
      id: "progress",
      eyebrow: "Результат",
      title: "Какой HSK",
      accent: "через год",
      paragraphs: [
        "Часть вузов прямо пишет, какой уровень HSK ждут от студента. Это цель программы, а не обещание. HUST и USST конкретный результат не обещают.",
      ],
      list: [
        "BJTU: подготовительная программа включает курс подготовки к HSK 4, чтобы сдать его за один год.",
        "SCNU, интенсив: после одного семестра — HSK 3⁠–⁠4, после двух — HSK 5 от 180 баллов.",
        "XISU и HIT, подготовительные программы: цель — HSK 4⁠–⁠5.",
      ],
      src: [2, 3, 4, 5],
    },
    {
      id: "age",
      eyebrow: "Возраст",
      title: "Лимиты возраста",
      accent: "у разных вузов",
      paragraphs: [
        "Единого лимита для студентов за свой счёт мы не нашли. Каждый вуз задаёт свой.",
      ],
      table: {
        caption: "Возраст для языковых курсов, примеры",
        head: ["Вуз", "Возраст"],
        rows: [
          ["SCNU (2026)", "18⁠–⁠40 лет"],
          ["SNNU", "18⁠–⁠50 лет"],
          ["BLCU, курс 1⁠–⁠2 года", "18⁠–⁠50 лет"],
          ["BLCU, курс до 6 месяцев", "18⁠–⁠60 лет"],
          ["Hainan University, программы без диплома", "18⁠–⁠60 лет"],
          ["Hohai University", "старше 16 лет"],
        ],
        src: [3, 11, 10, 12, 7],
      },
      src: [3, 11, 10, 12, 7],
    },
    {
      id: "attendance",
      eyebrow: "Посещаемость",
      title: "Пропуски",
      accent: "и виза",
      paragraphs: [
        "Вузы считают пропуски и наказывают за них по шкале. Отчисление влияет на визу и право находиться в Китае.",
      ],
      list: [
        "SJTU: 30 часов пропусков без уважительной причины — первое предупреждение, 50 — второе, 60 — взыскание и требование отчислиться.",
        "SJTU: оценка за мидтерм — значимый фактор при продлении студенческой визы. Отчисленный студент с визой X2 обязан сократить срок визы.",
        "HUST: 10 пропусков — предупреждение, 50 — отчисление.",
        "HUST: если студент 2 недели не подаёт заявление на отпуск, вуз сообщает в миграционную службу об аннулировании права на пребывание.",
        "SCNU: кто уже учил китайский в Китае, прикладывает к заявке справку о посещаемости не ниже 80%.",
      ],
      src: [8, 9, 3],
    },
    {
      id: "certificate",
      eyebrow: "Итог",
      title: "Справка",
      accent: "об окончании",
      paragraphs: [
        "В HUST справку об окончании и транскрипт выдают, если сданы экзамены и нет проблем с посещаемостью. SJTU требует пропусков не больше трети по каждому курсу и среднего балла от 60.",
        "В SJTU оценка складывается из трёх частей: работа на занятиях — 30%, мидтерм на 9-й неделе — 30%, финальный экзамен на 18-й неделе — 40%.",
      ],
      src: [1, 8],
    },
  ],
  faq: [
    { q: "Сколько часов в неделю идут занятия?", a: "Обычно 20⁠–⁠22 академических часа. На интенсивных и подготовительных программах — 30 часов в неделю." },
    { q: "Можно ли поехать на курсы без знания китайского?", a: "Да. В HUST есть начальные уровни A–B, новички сдают тест на уровень и попадают в свою группу. Исключение — короткие курсы: в 4-недельном курсе PKU уровня для начинающих с нуля нет." },
    { q: "Получу ли я HSK 4 за год?", a: "Это зависит от вас и программы. BJTU ставит цель сдать HSK 4 за год на подготовительной программе, SCNU ждёт HSK 3⁠–⁠4 после семестра интенсива. Гарантии вузы не дают." },
    { q: "До какого возраста берут на языковые курсы?", a: "Лимит задаёт вуз. В SCNU — до 40 лет, в SNNU и BLCU — до 50, на короткие курсы BLCU и в Hainan University — до 60." },
    { q: "Что будет, если пропускать занятия?", a: "Сначала предупреждение, потом отчисление. В HUST отчисляют после 50 пропусков. По правилам SJTU отчисленный студент с визой X2 обязан сократить срок визы." },
  ],
  sources: [
    { title: "Chinese Training Programs — Huazhong University of Science and Technology", url: "https://iso.hust.edu.cn/Programs/Non_Degree_Programs/Chinese_Training_Programs.htm" },
    { title: "Chinese Language Programs — Beijing Jiaotong University", url: "https://en.bjtu.edu.cn/academics/chinese/chinese/index.htm" },
    { title: "Chinese Language Program 2026 — South China Normal University", url: "https://english.scnu.edu.cn/a/20260104/1600.html" },
    { title: "Preparatory Program — Xi'an International Studies University", url: "https://six.xisu.edu.cn/lxxwywz/Admissions/Non_degree_Programs/Preparatory_Program.htm" },
    { title: "Preparatory Program — Harbin Institute of Technology", url: "https://en.hit.edu.cn/2025/0710/c11960a238525/page.htm" },
    { title: "Short-term Chinese Program — Peking University", url: "https://hanyu.pku.edu.cn/en/Study/1853bca39b8c454ea2c814f9c7c132e5.htm" },
    { title: "Admissions — Hohai University", url: "https://en.hhu.edu.cn/368/list.htm" },
    { title: "Campus Rules — Shanghai Jiao Tong University, International Chinese", url: "https://ichinese.sjtu.edu.cn/en/campus/29/detail" },
    { title: "Academic Policies — Huazhong University of Science and Technology", url: "https://iso.hust.edu.cn/Policies___Regulations/Academic_Policies.htm" },
    { title: "Admissions — Beijing Language and Culture University", url: "https://admission.blcu.edu.cn/en/77/list.htm" },
    { title: "Language Program — Shaanxi Normal University", url: "https://admission.snnu.edu.cn/EN/Non_Degree_Programs/Language_Program.htm" },
    { title: "Application Requirements — Hainan University", url: "https://en.hainanu.edu.cn/Admission/InternationalStudents/ApplicationInformation/Application_Requirements.htm" },
  ],
  related: [
    { href: "/wiki/hsk/", label: "Экзамен HSK" },
    { href: "/wiki/language-to-degree/", label: "С курсов на диплом" },
    { href: "/programs/language-year/", label: "Языковой год" },
  ],
};
