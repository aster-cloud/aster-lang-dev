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
  If amount > 100:
    produce amount * 90 / 100
  produce amount`,
    },
    {
      id: 'eligibility',
      name: 'Eligibility Check',
      source: `Module loan.

Define Applicant has creditScore as Int, income as Int, age as Int.

Rule checkEligibility given applicant as Applicant, produce Bool:
  If applicant.creditScore < 600:
    produce false
  If applicant.income < 30000:
    produce false
  If applicant.age < 18:
    produce false
  produce true`,
    },
    {
      id: 'struct-types',
      name: 'Struct Types',
      source: `Module insurance.

Define Vehicle has make as Text, year as Int, value as Int.
Define Quote has premium as Int, deductible as Int.

Rule calculateQuote given vehicle as Vehicle, produce Quote:
  If vehicle.year < 2015:
    produce Quote set premium to vehicle.value * 5 / 100, deductible to 1000
  produce Quote set premium to vehicle.value * 3 / 100, deductible to 500`,
    },
  ],
  ZH_CN: [
    {
      id: 'basic-rule',
      name: '基础规则',
      source: `模块 定价。

规则 计算价格 给定 金额 为 整数，产出 整数：
  如果 金额 > 100：
    产出 金额 * 90 / 100
  产出 金额`,
    },
    {
      id: 'eligibility',
      name: '资格审查',
      source: `模块 贷款。

定义 申请人 有 信用评分 为 整数，收入 为 整数，年龄 为 整数。

规则 审查资格 给定 申请人，产出 布尔：
  如果 申请人.信用评分 < 600：
    产出 假
  如果 申请人.收入 < 30000：
    产出 假
  如果 申请人.年龄 < 18：
    产出 假
  产出 真`,
    },
  ],
  DE_DE: [
    {
      id: 'basic-rule',
      name: 'Grundregel',
      source: `Modul Preisgestaltung.

Regel berechnePreis gegeben betrag als Ganzzahl, pibt Ganzzahl:
  Wenn betrag > 100:
    gibt betrag * 90 / 100
  gibt betrag`,
    },
  ],
};
