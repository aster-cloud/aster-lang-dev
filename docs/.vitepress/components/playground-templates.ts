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

规则 计算价格 给定 金额 为 整数，产出 整数：
  如果 金额 大于 100
    返回 金额 乘 90 除以 100。
  返回 金额。`,
    },
    {
      id: 'eligibility',
      name: '资格审查',
      source: `模块 贷款。

定义 申请人类型 包含 信用评分 为 整数，收入 为 整数，年龄 为 整数。

规则 审查资格 给定 申请人 为 申请人类型，产出 布尔：
  如果 申请人.信用评分 小于 600
    返回 假。
  如果 申请人.收入 小于 30000
    返回 假。
  如果 申请人.年龄 小于 18
    返回 假。
  返回 真。`,
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
  ],
};
