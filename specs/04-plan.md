# 04 · План — Chinana

> По `02-spec.md` v0.4, `03-design.md` (утверждён 2026-11-09) и стандарту.
> Статус: утверждён Ником 2026-11-09 («погнали дальше»)

## 1. Основа
- Стартер: `.starter/` v1.2 (Next.js 16, Tailwind 4, shadcn/ui, статический экспорт).
- Репозиторий: `~/Desktop/Chinana/site/`, GitHub `nikalimp/Chinana` (приватный). Работа агента — ветки `claude/*`, PR, автослияние; Ник разрешил агенту сливать PR самому (2026-11-07).
- Хостинг: REG.RU, виртуальный (ISPmanager). Выкладка — deploy-kit `ssh-ftp`: SSH → FTP → вручную с Mac.
- Тестовый адрес: `chinana.nikalimp.ru` — предложение, ждёт Ника. До выкладки — превью статической сборки как артефакт Claude.
- Домен: chinana.ru (REG.RU).

### Pre-flight хостинга
Пока не зелёное — дату запуска не называем. Мастер `deploy-kit/setup-site.sh nikalimp/Chinana chinana.ru` на Mac заводит секреты.
| Проверка | Результат | Дата |
|---|---|---|
| Сайт chinana.ru создан в ISPmanager по таблице «Хостинги — что проверено» | ⏳ Ник | |
| Выкладка из Actions: SSH (22) / FTP (21) | ⏳ пробный запуск после секретов | |
| HTTPS: галочка в ISPmanager, без правила `%{HTTPS}` в `.htaccess` | ✅ в стартере правила нет | 2026-11-09 |
| `.htaccess` для 404 | ✅ стартер | 2026-11-09 |
| PHP | не нужен: формы и бота нет (spec v0.4) | 2026-11-09 |
| A-запись `chinana.ru` и `www` | ⏳ Ник | |
| Секреты `FTP_*` (+ `SSH_*`) в GitHub | ⏳ Ник, мастер | |

- Исключения из стандарта: spec §9.

## 2. Контент-модель в коде
| Данные | Файл | Что меняется относительно стартера |
|---|---|---|
| Компания, контакты, реквизиты (самозанятый), CTA, флаги | `src/content/site.ts` | `legal.status: "самозанятый"`, без ОГРН; `features: { blog:false, leadForm:false, stats:false, reviews:false, news:false, calculator:false }`; `darkTheme:false` |
| Главная | `src/content/home.ts` | блоки spec §5 |
| Программы | `src/content/programs.ts` (новый, вместо `services.ts`) | 4 программы, поля spec §5 |
| Вузы | `src/content/universities.ts` (новый) | модель spec §4 «Серийные страницы»; `partner`, `newsSources[]` |
| Страницы-ответы | `src/content/answers.ts` (новый) | CSC, CSCA, HSK, стоимость: `answer`, факты с `sources[]`, шаги, FAQ |
| Новости (P1) | `content/news/*.md` | `design-news-factory.md` |
| Блог (P1) | `content/blog/*.md` | структура стартера, флаг выключен |

## 3. Маршруты
| URL | Файл | Шаблон | Schema |
|---|---|---|---|
| `/` | `src/app/page.tsx` | правка стартера | WebSite, Organization, FAQPage |
| `/programs/` | `src/app/programs/page.tsx` | новый (из `services/`) | ItemList |
| `/programs/[slug]/` | `src/app/programs/[slug]/page.tsx` | новый | Service, FAQPage, BreadcrumbList |
| `/grants/csc/`, `/exams/csca/`, `/exams/hsk/`, `/cost/` | `src/app/<путь>/page.tsx` из шаблона `AnswerPage` | новый | Article, FAQPage |
| `/universities/` | `src/app/universities/page.tsx` | новый | ItemList, FAQPage |
| `/universities/[slug]/` | `src/app/universities/[slug]/page.tsx` | новый | CollegeOrUniversity, BreadcrumbList |
| `/contacts/`, `/privacy-policy/`, `/consent/` | стартер | правка | ContactPage |
| `/services/`, `/about/` | удаляются (их нет в spec) | — | — |

## 4. Компоненты
| Компонент | Откуда | Зачем |
|---|---|---|
| `GridLines` | свой | 12 направляющих на фоне секций |
| `Section`, `SectionHead` | свой | секция с линиями и заголовком по центру (eyebrow, H2 с курсивом капсом, подзаголовок) |
| `Cards` | свой | сетка карточек без зазоров, границы по направляющим |
| `ProgramCard`, `UniCard`, `StepCard`, `FactCard` | свой | карточки прототипов |
| `Faq` | стартер, рестайл | `<details>`, FAQPage в JSON-LD |
| `CtaFinal` | свой | красный блок с кнопкой @chinana |
| `Header`, `Footer` | стартер, рестайл | навигация spec §4 |
| `Button` | shadcn/ui стартера | pill-кнопки: `primary`, `outline`, `yellow`, `inverse` |

## 5. Интеграции
| Что | Как | Секреты / доступы |
|---|---|---|
| Метрика | `site.metrikaId` | номер счётчика — `TODO(Ник)` |
| CTA | ссылка https://t.me/chinana | — |
| Деплой | `.github/workflows/deploy.yml` (deploy-kit), `scripts/deploy-site.sh` | `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_DIR`; `SSH_*` |
| Шрифты | `@fontsource/onest`, `@fontsource/pt-serif` (italic 400), `@fontsource/jetbrains-mono`, `@fontsource/noto-serif-sc` (делится на диапазоны, браузер грузит только нужные) | — |

## 6. Порядок работ
1. Каркас: `site.ts`, токены и шрифты, шапка, футер, сетка, удаление `services/` и `about/`.
2. Главная и программы (список + 4 страницы).
3. Контакты, политика, согласие под самозанятого.
4. Превью сборки — артефакт Claude для Ника.
5. Страницы-ответы: CSC, CSCA, HSK, стоимость — факты с источниками.
6. Каталог вузов: модель, список, страница вуза, 20 вузов с источниками.
7. GEO и SEO: llms.txt, sitemap, мета, OG.
8. Проверки, pre-flight, тестовая выкладка, запуск.

## 7. Риски
| Риск | Что делаем |
|---|---|
| Нет фактов партнёра (цифры, кейсы, отзывы, список вузов) | Блоки выключены флагами; у всех вузов `partner:false` |
| Иероглифический шрифт тяжёлый | Noto Serif SC из fontsource режется по `unicode-range`; замер на проверке, при превышении — свой subset |
| Цены — ориентиры | `// estimate` в коде, `npm run check` их выводит; подтвердить до запуска |
| Данные вузов устаревают | у каждого факта `sources[]` и дата сбора; новостной поток (P1) обновляет страницы |
