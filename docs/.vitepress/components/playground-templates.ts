export interface Template {
  id: string;
  name: string;
  source: string;
}

export const templates: Record<string, Template[]> = {
  EN_US: [
    {
      id: 'basic-rule',
      name: 'Basic Rule',
      source: `Module pricing.

Rule calculatePrice given amount as Int, produce Int:
  If amount greater than 100
    Return amount times 90 divided by 100.
  Return amount.`,
    },
    {
      id: 'eligibility',
      name: 'Eligibility Check',
      source: `Module loan.

Define Applicant has creditScore as Int, income as Int, age as Int.

Rule checkEligibility given applicant as Applicant, produce Bool:
  If applicant.creditScore less than 600
    Return false.
  If applicant.income less than 30000
    Return false.
  If applicant.age less than 18
    Return false.
  Return true.`,
    },
    {
      id: 'struct-types',
      name: 'Struct Types',
      source: `Module insurance.

Define Vehicle has make as Text, year as Int, value as Int.
Define Quote has premium as Int, deductible as Int.

Rule calculateQuote given vehicle as Vehicle, produce Quote:
  If vehicle.year less than 2015
    Return Quote with premium set to vehicle.value times 5 divided by 100, deductible set to 1000.
  Return Quote with premium set to vehicle.value times 3 divided by 100, deductible set to 500.`,
    },
  ],
  ZH_CN: [
    {
      id: 'basic-rule',
      name: '基础规则',
      source: `模块 定价。

规则 计算价格 给定 金额 作为 整数，产出 整数：
  如果 金额 大于 100
    返回 金额 乘 90 除以 100。
  返回 金额。`,
    },
    {
      id: 'eligibility',
      name: '资格审查',
      source: `模块 贷款。

定义 申请人类型 包含 信用评分 作为 整数，收入 作为 整数，年龄 作为 整数。

规则 审查资格 给定 申请人 作为 申请人类型，产出 布尔：
  如果 申请人.信用评分 小于 600
    返回 假。
  如果 申请人.收入 小于 30000
    返回 假。
  如果 申请人.年龄 小于 18
    返回 假。
  返回 真。`,
    },
    {
      id: 'struct-types',
      name: '结构类型',
      source: `模块 保险。

定义 车辆类型 包含 品牌 作为 文本，年份 作为 整数，价值 作为 整数。
定义 报价类型 包含 保费 作为 整数，免赔额 作为 整数。

规则 计算报价 给定 车辆 作为 车辆类型，产出 报价类型：
  如果 车辆.年份 小于 2015
    返回 报价类型 设置 保费 为 车辆.价值 乘 5 除以 100，免赔额 为 1000。
  返回 报价类型 设置 保费 为 车辆.价值 乘 3 除以 100，免赔额 为 500。`,
    },
  ],
  DE_DE: [
    {
      id: 'basic-rule',
      name: 'Grundregel',
      source: `Modul Preisgestaltung.

Regel berechnePreis gegeben betrag als Ganzzahl, liefert Ganzzahl:
  wenn betrag groesser als 100
    gib zurueck betrag mal 90 geteilt durch 100.
  gib zurueck betrag.`,
    },
    {
      id: 'eligibility',
      name: 'Berechtigungspruefung',
      source: `Modul kredit.

definiere Antragsteller hat bonitaet als Ganzzahl, einkommen als Ganzzahl, alter als Ganzzahl.

Regel pruefeBerechtigung gegeben antragsteller als Antragsteller, liefert Wahrheit:
  wenn antragsteller.bonitaet kleiner als 600
    gib zurueck falsch.
  wenn antragsteller.einkommen kleiner als 30000
    gib zurueck falsch.
  wenn antragsteller.alter kleiner als 18
    gib zurueck falsch.
  gib zurueck wahr.`,
    },
    {
      id: 'struct-types',
      name: 'Strukturtypen',
      source: `Modul versicherung.

definiere Fahrzeug hat marke als Text, baujahr als Ganzzahl, wert als Ganzzahl.
definiere Angebot hat praemie als Ganzzahl, selbstbehalt als Ganzzahl.

Regel berechneAngebot gegeben fahrzeug als Fahrzeug, liefert Angebot:
  wenn fahrzeug.baujahr kleiner als 2015
    gib zurueck Angebot mit praemie gesetzt auf fahrzeug.wert mal 5 geteilt durch 100, selbstbehalt gesetzt auf 1000.
  gib zurueck Angebot mit praemie gesetzt auf fahrzeug.wert mal 3 geteilt durch 100, selbstbehalt gesetzt auf 500.`,
    },
  ],
};
