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

Rule calculatePrice given amount, produce:
  If amount greater than 100
    Return amount times 90 divided by 100.
  Return amount.`,
    },
    {
      id: 'eligibility',
      name: 'Eligibility Check',
      source: `Module loan.

Define Applicant has creditScore, income, age.

Rule checkEligibility given applicant, produce:
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

Define Vehicle has make, year, value.
Define Quote has premium, deductible.

Rule calculateQuote given vehicle, produce:
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

规则 计算价格 给定 金额，产出：
  如果 金额 大于 100
    返回 金额 乘 90 除以 100。
  返回 金额。`,
    },
    {
      id: 'eligibility',
      name: '资格审查',
      source: `模块 贷款。

定义 申请人 包含 信用评分，收入，年龄。

规则 审查资格 给定 申请人，产出：
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

Regel berechnePreis gegeben betrag, liefert:
  wenn betrag groesser als 100
    gib zurueck betrag mal 90 geteilt durch 100.
  gib zurueck betrag.`,
    },
  ],
};
