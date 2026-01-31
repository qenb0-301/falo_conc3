const WHATSAPP_PHONE = "7XXXXXXXXXX";
const BRAND_NAME = "Boston Scientific";
const MODELS = [
  {
    name: "AMS 700™",
    features: [
      "Регулируемый уровень жёсткости",
      "Надёжный контроль в повседневной жизни",
      "Подходит для разных сценариев активности",
    ],
  },
  {
    name: "AMS Ambicor™",
    features: [
      "Двухкомпонентная система",
      "Простота управления",
      "Быстрое восстановление привычного ритма",
    ],
  },
  {
    name: "Spectra™",
    features: [
      "Полуригидная конструкция",
      "Минимум действий при использовании",
      "Устойчивость и предсказуемость",
    ],
  },
];

const DOCTORS = [
  {
    id: "dr-1",
    name: "Еремеев Павел Сергеевич",
    city: "Москва",
    experienceYears: 18,
    credentials: [
      "Кандидат медицинских наук",
      "Профиль: реконструктивная урология",
      "Более 500 операций",
    ],
    photo: "assets/doctor-placeholder.svg",
  },
  {
    id: "dr-2",
    name: "Бородина Мария Игоревна",
    city: "Санкт-Петербург",
    experienceYears: 15,
    credentials: [
      "Сертифицированный специалист по имплантам",
      "Профиль: андрология",
      "Участник международных конференций",
    ],
    photo: "assets/doctor-placeholder.svg",
  },
  {
    id: "dr-3",
    name: "Князев Алексей Валерьевич",
    city: "Екатеринбург",
    experienceYears: 12,
    credentials: [
      "Опыт сложных клинических случаев",
      "Профиль: урология",
      "Более 300 операций",
    ],
    photo: "assets/doctor-placeholder.svg",
  },
  {
    id: "dr-4",
    name: "Громов Илья Владимирович",
    city: "Новосибирск",
    experienceYears: 14,
    credentials: [
      "Сертификация по стандарту USA implants",
      "Профиль: урология",
      "Фокус на послеоперационном сопровождении",
    ],
    photo: "assets/doctor-placeholder.svg",
  },
  {
    id: "dr-5",
    name: "Самойлова Ольга Андреевна",
    city: "Казань",
    experienceYears: 11,
    credentials: [
      "Профиль: андрология",
      "Более 250 операций",
      "Фокус на персональном плане восстановления",
    ],
    photo: "assets/doctor-placeholder.svg",
  },
  {
    id: "dr-6",
    name: "Лебедев Артём Викторович",
    city: "Краснодар",
    experienceYears: 16,
    credentials: [
      "Профиль: реконструктивная урология",
      "Клинический опыт в 8 городах",
      "Разработка протоколов наблюдения",
    ],
    photo: "assets/doctor-placeholder.svg",
  },
];

const buildWhatsAppLink = ({ city, doctorName } = {}) => {
  const baseMessage =
    "Здравствуйте. Хочу разобраться в процессе фаллопротезирования. Прошу сохранить конфиденциальность.";
  const cityText = city ? ` Город: ${city}.` : " Город: [ваш город].";
  const doctorText = doctorName ? ` Интересует врач: ${doctorName}.` : "";
  const message = `${baseMessage}${cityText}${doctorText}`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
};

const setWhatsAppLinks = () => {
  const buttons = document.querySelectorAll("[data-whatsapp]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      window.open(buildWhatsAppLink(), "_blank", "noopener,noreferrer");
    });
  });
};

const renderModels = () => {
  const container = document.querySelector("[data-models]");
  const brand = document.querySelector("[data-brand]");
  if (!container || !brand) return;
  brand.textContent = BRAND_NAME;
  container.innerHTML = MODELS.map(
    (model) => `
      <article class="implant-card">
        <h3>${model.name}</h3>
        <ul>
          ${model.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </article>
    `
  ).join("");
};

const renderDoctors = (filterCity = "all") => {
  const container = document.querySelector("[data-doctors]");
  if (!container) return;
  const filtered =
    filterCity === "all"
      ? DOCTORS
      : DOCTORS.filter((doctor) => doctor.city === filterCity);

  container.innerHTML = filtered
    .map((doctor) => {
      const creds = doctor.credentials.map((item) => `<li>${item}</li>`).join("");
      return `
        <article class="doctor-card">
          <img src="${doctor.photo}" alt="${doctor.name}" loading="lazy" />
          <h3>${doctor.name}</h3>
          <div class="doctor-meta">
            <span>${doctor.city}</span>
            <span>Стаж: ${doctor.experienceYears} лет</span>
          </div>
          <ul class="doctor-credentials">${creds}</ul>
          <button class="btn btn-primary" data-doctor="${doctor.id}">
            Выбрать этого врача и написать анонимно
          </button>
        </article>
      `;
    })
    .join("");

  const doctorButtons = container.querySelectorAll("[data-doctor]");
  doctorButtons.forEach((button) => {
    const doctor = DOCTORS.find((item) => item.id === button.dataset.doctor);
    if (!doctor) return;
    button.addEventListener("click", () => {
      window.open(
        buildWhatsAppLink({ city: doctor.city, doctorName: doctor.name }),
        "_blank",
        "noopener,noreferrer"
      );
    });
  });
};

const setupCityFilter = () => {
  const select = document.querySelector("#cityFilter");
  if (!select) return;
  const cities = Array.from(new Set(DOCTORS.map((doctor) => doctor.city))).sort();
  select.innerHTML = [
    '<option value="all">Все города</option>',
    ...cities.map((city) => `<option value="${city}">${city}</option>`),
  ].join("");

  select.addEventListener("change", (event) => {
    renderDoctors(event.target.value);
  });
};

const setupAccordion = () => {
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      triggers.forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        const panel = item.nextElementSibling;
        if (panel) panel.hidden = true;
      });
      trigger.setAttribute("aria-expanded", String(!expanded));
      const panel = trigger.nextElementSibling;
      if (panel) panel.hidden = expanded;
    });
  });
};

const setYear = () => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

const init = () => {
  setWhatsAppLinks();
  renderModels();
  renderDoctors();
  setupCityFilter();
  setupAccordion();
  setYear();
};

document.addEventListener("DOMContentLoaded", init);
