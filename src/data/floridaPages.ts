export type GuideSection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type GuidePage = {
  slug: string;
  context: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  description: string;
  quickAnswer: string;
  cardSummary: string;
  cta: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
};

export const floridaPages: GuidePage[] = [
  {
    slug: 'health-insurance-after-losing-job', context: 'job_loss', eyebrow: 'Job loss coverage guide',
    title: 'Health Insurance After Losing a Job in Florida', metaTitle: 'Health Insurance After Losing a Job in Florida (2026)',
    description: 'Lost job-based health insurance in Florida? Compare Marketplace coverage, COBRA, a spouse’s plan, Medicaid and CHIP, plus the deadlines that matter.',
    quickAnswer: 'Losing job-based insurance—even if you quit or were fired—can qualify you for a Marketplace Special Enrollment Period. In most cases, apply within 60 days before or 60 days after the coverage loss.',
    cardSummary: 'Compare Marketplace coverage, COBRA, spouse coverage and public programs after employer insurance ends.', cta: 'Check My Options',
    sections: [
      { heading: 'Your first decision is usually Marketplace coverage versus COBRA', paragraphs: [
        'A Marketplace plan gives you a new individual policy. Your premium and possible savings depend on your Florida ZIP code, ages, household size, expected full-year household income and access to other coverage. COBRA keeps the employer plan you already know, usually with the same network and deductible progress, but you generally pay the full premium plus an administrative fee.',
        'Start by finding the exact date your employer coverage ends—not merely your last workday. Then compare total monthly premium, deductible, out-of-pocket limit, prescriptions and whether your doctors are in-network. A lower premium can still cost more overall if the deductible or provider network is a poor fit.'
      ], bullets: ['Marketplace: a new plan, possible income-based savings, new network and deductible.', 'COBRA: the same employer plan for a limited period, generally at the full cost.', 'Spouse or partner’s employer plan: ask the benefits office about its special enrollment deadline.', 'Medicaid or Florida KidCare: eligibility depends on household circumstances, age, pregnancy, disability, children and income.'] },
      { heading: 'The 60-day window matters', paragraphs: [
        'HealthCare.gov says loss of qualifying job-based coverage can create a Special Enrollment Period. You can generally enroll during the 60 days before the loss or the 60 days after it. Applying before coverage ends is the safer way to reduce the chance of a gap. Marketplace coverage after job-based insurance typically starts on the first day of the following month.',
        'Keep the termination letter, benefits notice or another document showing who lost coverage and the last day of coverage. For plan year 2026, the federal Marketplace increased pre-enrollment verification for many Special Enrollment Period enrollments, so missing proof can delay coverage.'
      ] },
      { heading: 'How income and subsidies work after a layoff', paragraphs: [
        'Marketplace savings use your estimate of total household income for the entire calendar year. Income earned before the job ended still counts. Include the people in your tax household, then update the Marketplace if income or access to employer coverage changes later.',
        'The temporary enhanced Marketplace tax credits ended after 2025. That means many people pay more for 2026 coverage, and households above the applicable subsidy limit may not receive a premium tax credit. Get an actual Marketplace determination before assuming a plan will be free or heavily discounted.'
      ] },
      { heading: 'When COBRA can be the stronger choice', paragraphs: [
        'COBRA may be useful when you are in active treatment, have already spent heavily toward the employer plan deductible, need a provider who is hard to replace or expect a short gap before new employer coverage begins. Because COBRA can be elected retroactively within its election period if the rules are met, it can also provide a decision window—but deadlines and premium payments are strict.',
        'Do not cancel COBRA assuming that cancellation creates a new Marketplace enrollment right. HealthCare.gov states that voluntarily dropping COBRA before it expires generally does not create a Special Enrollment Period. Compare before electing or ending it.'
      ] },
      { heading: 'A practical checklist', paragraphs: ['Gather the information below before comparing plans or speaking with a licensed professional. It makes the review faster and helps prevent surprises.'], bullets: ['Exact last day of employer coverage', 'COBRA monthly premium and election deadline', 'Current doctors, hospitals and prescriptions', 'Expected full-year tax-household income', 'Any spouse or partner employer-plan offer', 'Florida ZIP code and everyone who needs coverage'] }
    ],
    faqs: [
      { question: 'Do I qualify if I quit my job?', answer: 'Yes, if quitting causes you to lose qualifying job-based health insurance. HealthCare.gov states that leaving for any reason—including quitting or being fired—can qualify you for this Special Enrollment Period.' },
      { question: 'Does my Marketplace plan start the day my job coverage ends?', answer: 'Generally no. HealthCare.gov says coverage typically starts the first day of the month after job-based coverage ends. Apply before the loss when possible to reduce a gap.' },
      { question: 'Does income I earned before losing my job count?', answer: 'Yes. Marketplace savings are based on estimated income for the full calendar year for everyone in your tax household.' },
      { question: 'Can I choose Marketplace coverage instead of a spouse’s plan?', answer: 'You can buy a Marketplace plan, but an offer of affordable job-based coverage that meets minimum value can make you ineligible for premium tax credits—even if you decline that offer.' },
      { question: 'Will I need proof of the coverage loss?', answer: 'You may. Save notices from the employer, plan or COBRA administrator showing the affected people and the end date.' }
    ],
    sources: [
      { label: 'HealthCare.gov — If you lose job-based health insurance', url: 'https://www.healthcare.gov/have-job-based-coverage/if-you-lose-job-based-coverage/' },
      { label: 'HealthCare.gov — Special Enrollment Periods', url: 'https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/' },
      { label: 'U.S. Department of Labor — COBRA continuation coverage', url: 'https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/cobra' },
      { label: 'CMS — 2025 Marketplace Integrity and Affordability Final Rule', url: 'https://www.cms.gov/newsroom/fact-sheets/2025-marketplace-integrity-and-affordability-final-rule' }
    ]
  },
  {
    slug: 'losing-medicaid', context: 'medicaid_loss', eyebrow: 'Medicaid transition guide',
    title: 'Losing Medicaid in Florida: What to Do Next', metaTitle: 'Lost Medicaid in Florida? Coverage Options and Deadlines',
    description: 'If Florida Medicaid is ending, understand appeal and renewal steps, the Marketplace 90-day window, Florida KidCare, and how to avoid a coverage gap.',
    quickAnswer: 'If you lose Medicaid or CHIP, you may qualify for a Marketplace Special Enrollment Period for up to 90 days after the loss. First read the Florida notice carefully: you may still be able to renew, provide missing information or appeal.',
    cardSummary: 'Use the Medicaid notice, check renewal or appeal rights, and compare the Marketplace and Florida KidCare.', cta: 'Check My Next Step',
    sections: [
      { heading: 'Start with the reason coverage is ending', paragraphs: ['A termination notice may reflect an income change, age or household change, missing verification, missed renewal or another eligibility decision. The reason affects what you should do next. Follow the notice instructions and deadline if you believe Florida used incorrect or incomplete information.', 'Do not wait for the last day to act. Keep the notice, case number, documents you submit and screenshots or confirmation numbers from any renewal or appeal.'] },
      { heading: 'Marketplace coverage may be available for 90 days after the loss', paragraphs: ['HealthCare.gov provides a longer post-loss window for Medicaid or CHIP than for many other coverage losses: you may qualify if the loss happened in the past 90 days. A Marketplace application can also screen household members for Medicaid or CHIP.', 'Marketplace premium savings depend on expected annual tax-household income and other eligibility rules. Florida has not adopted the ACA adult Medicaid expansion, so some low-income adults can face a coverage gap. A Marketplace decision—not a lead form estimate—is the authoritative eligibility result.'] },
      { heading: 'Children may have a different path than adults', paragraphs: ['Children and some pregnant applicants may qualify through Florida Medicaid or Florida KidCare even when a parent does not. Check each household member separately rather than assuming one decision applies to everyone.', 'If an adult moves to Marketplace coverage while a child remains eligible for Medicaid or KidCare, the household can have different coverage sources. That split is common and can be appropriate.'] },
      { heading: 'Documents to gather', paragraphs: ['Prepare the Florida eligibility notice, proof of current household income, identity and immigration documents requested by the official application, current address and information about other available health coverage. Do not send medical histories to a lead service.'] }
    ],
    faqs: [
      { question: 'How long do I have after losing Medicaid?', answer: 'HealthCare.gov says people who lost Medicaid or CHIP in the past 90 days may qualify for a Special Enrollment Period.' },
      { question: 'Should I appeal or apply for Marketplace coverage?', answer: 'You may be able to do both. Follow the appeal instructions if the Medicaid decision may be wrong, and check Marketplace timing so you do not miss a separate enrollment window.' },
      { question: 'Can my children keep coverage if I lose mine?', answer: 'Possibly. Children have different Medicaid and Florida KidCare eligibility rules, so each family member should be evaluated.' },
      { question: 'Does losing Medicaid guarantee a subsidy?', answer: 'No. It may open an enrollment window, while financial assistance depends on household income, tax household, other coverage access and federal eligibility rules.' }
    ],
    sources: [
      { label: 'Florida DCF — Medicaid', url: 'https://www.myflfamilies.com/services/public-assistance/medicaid' },
      { label: 'HealthCare.gov — Special Enrollment Periods', url: 'https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/' },
      { label: 'Florida KidCare — Eligibility', url: 'https://www.floridakidcare.org/eligibility/' }
    ]
  },
  {
    slug: 'turning-26', context: 'turning_26', eyebrow: 'Aging off a parent’s plan',
    title: 'Turning 26 in Florida: Your Health Insurance Options', metaTitle: 'Turning 26 in Florida: Health Insurance Options (2026)',
    description: 'Turning 26 and losing a parent’s health plan in Florida? Compare Marketplace, employer, student and COBRA options before coverage ends.',
    quickAnswer: 'Losing coverage because you turn 26 can qualify you for a Marketplace Special Enrollment Period. Confirm the exact end date with the parent’s plan, because employer and Marketplace dependent coverage can end on different schedules.',
    cardSummary: 'Confirm when the parent plan ends and compare employer, Marketplace, student and COBRA coverage.', cta: 'Check My Options',
    sections: [
      { heading: 'Ask the plan for your exact last covered day', paragraphs: ['Most dependent coverage is available until age 26, but the termination date can depend on the plan. HealthCare.gov says a person on a parent’s Marketplace plan can generally remain covered through December 31 of the year they turn 26. Job-based plans may use a different end date.', 'Get the date in writing. You can generally use the 60 days before the loss and 60 days after it to select Marketplace coverage, but applying beforehand helps avoid a gap.'] },
      { heading: 'Compare all available paths', paragraphs: ['If your own employer offers insurance, ask when you can enroll after losing dependent coverage. Also check Marketplace plans, a spouse’s employer plan, a school-sponsored plan and COBRA if available. Compare networks and prescriptions along with the premium.', 'A Marketplace tax credit depends partly on whether an affordable employer plan is available and on how you file taxes. If a parent still claims you as a tax dependent, the parent’s tax household information may affect the application.'] },
      { heading: 'What to gather before choosing', paragraphs: ['Bring the dependent coverage termination notice, expected full-year household income, tax-dependent status, Florida ZIP code, employer offer details, doctor list and prescription list. If your address or tax household will change soon, say so during the review.'] },
      { heading: 'Do not rely on the birthday alone', paragraphs: ['A common mistake is assuming coverage ends at midnight on the 26th birthday. Ask the insurer or benefits department. Your replacement coverage effective date should be coordinated with the actual termination date.'] }
    ],
    faqs: [
      { question: 'Does turning 26 automatically create a Special Enrollment Period?', answer: 'Losing qualifying dependent coverage because of age can create one. Voluntarily dropping coverage without another qualifying event may not.' },
      { question: 'Can I enroll before my current plan ends?', answer: 'Generally yes. The loss-of-coverage window can begin 60 days before the end date, which helps prevent a gap.' },
      { question: 'Can I use COBRA after turning 26?', answer: 'It may be available from an employer-sponsored parent plan. Ask the plan administrator for the election notice, premium and deadlines.' },
      { question: 'Does Florida let me stay on a parent’s plan after 26?', answer: 'Some Florida policies may have dependent-continuation provisions with specific conditions. Confirm directly with the insurer and the Florida Department of Financial Services because plan type matters.' }
    ],
    sources: [
      { label: 'HealthCare.gov — Turning 26', url: 'https://www.healthcare.gov/turning-26/' },
      { label: 'HealthCare.gov — Coverage for children and young adults', url: 'https://www.healthcare.gov/young-adults/children-under-26/' },
      { label: 'U.S. Department of Labor — Young adults and the ACA', url: 'https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/faqs/young-adult-and-aca' }
    ]
  },
  {
    slug: 'cobra-alternatives', context: 'cobra', eyebrow: 'COBRA comparison guide',
    title: 'COBRA Alternatives in Florida', metaTitle: 'COBRA Alternatives in Florida: Compare Your Options',
    description: 'Compare ACA Marketplace plans, spouse coverage, Medicaid, Florida KidCare and other alternatives before electing or ending COBRA.',
    quickAnswer: 'The main COBRA alternatives are a Marketplace plan, a spouse’s employer plan, Medicaid or Florida KidCare when eligible, and a new employer plan. Compare before voluntarily ending COBRA because that choice usually does not create a new Marketplace enrollment window.',
    cardSummary: 'Compare COBRA with Marketplace, spouse, public-program and new-employer coverage.', cta: 'Compare My Path',
    sections: [
      { heading: 'COBRA and Marketplace solve different problems', paragraphs: ['COBRA preserves the employer plan for a limited time. That can protect access to current specialists and money already spent toward a deductible. A Marketplace plan starts a new policy and deductible, but may have a lower premium when a household qualifies for tax credits.', 'Compare the full monthly cost, remaining deductible, annual out-of-pocket maximum, network, formulary and expected length of the coverage gap.'] },
      { heading: 'Timing can limit your choices', paragraphs: ['Losing the employer plan can open a Marketplace window. COBRA expiration can also qualify. Voluntarily stopping COBRA early or stopping payment generally does not. If you are already on COBRA, identify whether you still have another enrollment right before cancelling.', 'COBRA election rules may allow retroactive coverage after a timely election and payment, but do not treat that as unlimited free coverage. Request the official election notice and follow every date in it.'] },
      { heading: 'Other alternatives to check', paragraphs: ['A spouse’s plan may allow special enrollment after your loss of other coverage. A new employer plan can work after its waiting period. Medicaid and Florida KidCare use program-specific rules. Short-term products are not substitutes for ACA coverage: benefits, exclusions, renewability and pre-existing-condition rules can differ materially.'] },
      { heading: 'Use total risk, not premium alone', paragraphs: ['A plan with a low monthly premium can expose you to a larger deductible or narrower network. Add likely prescriptions and visits, then compare worst-case annual exposure. If continuity of care is important, verify providers directly with both the insurer and medical office.'] }
    ],
    faqs: [
      { question: 'Is Marketplace coverage always cheaper than COBRA?', answer: 'No. Marketplace premiums may be lower, especially with a tax credit, but a new deductible or network can make total cost higher for some people.' },
      { question: 'Can I cancel COBRA and then get an ACA plan?', answer: 'Voluntarily ending COBRA usually does not create a Special Enrollment Period. You need another enrollment right or Open Enrollment.' },
      { question: 'How long does COBRA usually last after job loss?', answer: 'Federal COBRA commonly provides up to 18 months after job loss or reduced hours, though circumstances and other qualifying events can change the period.' },
      { question: 'Can family members choose different options?', answer: 'Often yes. One person may elect COBRA while others use a Marketplace or employer plan, subject to each option’s rules.' }
    ],
    sources: [
      { label: 'HealthCare.gov — COBRA and Marketplace coverage', url: 'https://www.healthcare.gov/unemployed/cobra-coverage/' },
      { label: 'U.S. Department of Labor — COBRA continuation coverage', url: 'https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/cobra' },
      { label: 'HealthCare.gov — If you lose job-based coverage', url: 'https://www.healthcare.gov/have-job-based-coverage/if-you-lose-job-based-coverage/' }
    ]
  },
  {
    slug: 'self-employed', context: 'self_employed', eyebrow: 'Independent worker coverage',
    title: 'Self-Employed Health Insurance in Florida', metaTitle: 'Self-Employed Health Insurance in Florida (2026)',
    description: 'Compare Marketplace and other health insurance options for freelancers, business owners and independent workers in Florida.',
    quickAnswer: 'Self-employed Floridians can use HealthCare.gov to compare individual Marketplace plans. Savings depend on estimated annual household income, not on being self-employed, and income should be updated if business results change.',
    cardSummary: 'Plan around variable income, tax-household rules, provider networks and enrollment timing.', cta: 'Check My Options',
    sections: [
      { heading: 'Marketplace coverage is the main ACA path', paragraphs: ['If you have no employees other than a spouse, HealthCare.gov generally treats you as self-employed and directs you to the individual Marketplace. If the business has employees, small-group rules may apply instead.', 'Marketplace plans cover ACA essential health benefits and cannot price coverage based on medical history. Premium tax credits require additional eligibility rules, including income and lack of an affordable qualifying employer offer.'] },
      { heading: 'Estimate income carefully', paragraphs: ['Use expected net self-employment income and the other income included in Marketplace modified adjusted gross income for the full year. Business revenue is not the same as household income. Update the Marketplace when your estimate materially changes.', 'Keep bookkeeping current. For plan year 2026, income documentation and reconciliation rules are stricter, so organized records can prevent delays and reduce tax-time surprises.'] },
      { heading: 'Compare plan fit for how you work', paragraphs: ['Consider whether you travel across Florida or work in multiple states, because many individual plans use local networks. Check telehealth, prescriptions, urgent care, specialists and hospitals. If you use an HSA, verify that the plan is HSA-eligible rather than assuming every high-deductible plan qualifies.'] },
      { heading: 'Tax treatment is separate from Marketplace savings', paragraphs: ['Some self-employed people may qualify for a federal self-employed health insurance deduction. That tax rule is separate from the Marketplace premium tax credit. Ask a tax professional or use current IRS guidance for your filing situation.'] }
    ],
    faqs: [
      { question: 'Can a self-employed person get an ACA subsidy?', answer: 'Possibly. Eligibility depends on projected household income and other coverage access, not the self-employed label itself.' },
      { question: 'Should I enter gross business revenue as income?', answer: 'Generally no. HealthCare.gov explains that self-employed applicants report estimated net income from the business, along with other required household income.' },
      { question: 'What if my income changes every month?', answer: 'Make a reasonable annual estimate using current information, keep records and update the Marketplace when your expected annual income changes.' },
      { question: 'Can I buy small-business insurance for only myself?', answer: 'HealthCare.gov generally directs a self-employed person with no employees to the individual Marketplace. Rules can differ when there are eligible employees.' }
    ],
    sources: [
      { label: 'HealthCare.gov — Self-employed people', url: 'https://www.healthcare.gov/self-employed/' },
      { label: 'HealthCare.gov — Estimate self-employment income', url: 'https://www.healthcare.gov/self-employed/income/' },
      { label: 'IRS — Instructions for Schedule 1', url: 'https://www.irs.gov/instructions/i1040gi' }
    ]
  },
  {
    slug: '1099-health-insurance', context: 'self_employed', eyebrow: 'Independent contractor guide',
    title: '1099 Health Insurance in Florida', metaTitle: '1099 Health Insurance in Florida for Contractors',
    description: 'Health insurance options for Florida 1099 contractors, gig workers and freelancers, including Marketplace income estimates and enrollment timing.',
    quickAnswer: 'A 1099 contractor usually shops for individual coverage rather than receiving an employer plan. The Health Insurance Marketplace is the main ACA option, and the application uses estimated full-year household income.',
    cardSummary: 'A focused guide for contractors balancing variable income, eligibility and network needs.', cta: 'Check My Options',
    sections: [
      { heading: '1099 status does not create a separate insurance category', paragraphs: ['Independent contractors generally use the same individual Marketplace as other people without job-based coverage. The important questions are whether you have another employer offer, when you can enroll, where you live and your projected tax-household income.', 'A new 1099 contract by itself does not necessarily create a Special Enrollment Period. Losing prior qualifying coverage, moving, marriage, birth and other listed events may create one.'] },
      { heading: 'Use net business income in your estimate', paragraphs: ['HealthCare.gov instructs self-employed applicants to estimate net self-employment income. Keep invoices and expense records, and avoid treating every deposit as household income without accounting for allowable business expenses.', 'Your application should reflect the full coverage year. If a W-2 job ended earlier in the same year, those wages still count toward annual household income.'] },
      { heading: 'Plan for uneven cash flow', paragraphs: ['Compare premium due dates, deductible, copays and out-of-pocket maximum. A slightly higher premium can sometimes produce more predictable costs. Verify whether an HSA-eligible plan fits your tax and cash-flow goals.', 'Set a reminder to update Marketplace income after a major contract begins or ends. A more accurate estimate can reduce the chance of receiving too much or too little advance premium tax credit.'] },
      { heading: 'If you work through a staffing platform', paragraphs: ['Ask whether the platform or staffing company actually offers qualifying employer coverage. An affordable employer offer can change Marketplace subsidy eligibility even if you prefer the individual plan.'] }
    ],
    faqs: [
      { question: 'Can a 1099 worker use HealthCare.gov?', answer: 'Yes. Contractors without qualifying job-based coverage commonly use the individual Marketplace.' },
      { question: 'Does starting freelance work let me enroll anytime?', answer: 'Not by itself. Outside Open Enrollment, you generally need a listed qualifying life event or another enrollment route.' },
      { question: 'Do I count income before expenses?', answer: 'HealthCare.gov’s self-employment guidance uses estimated net income, while the application also includes other household income required under Marketplace rules.' },
      { question: 'Can health premiums be deductible?', answer: 'Some self-employed taxpayers may qualify for a federal deduction. Use current IRS instructions or a tax professional because tax circumstances vary.' }
    ],
    sources: [
      { label: 'HealthCare.gov — Self-employed people', url: 'https://www.healthcare.gov/self-employed/' },
      { label: 'HealthCare.gov — Estimate self-employment income', url: 'https://www.healthcare.gov/self-employed/income/' },
      { label: 'HealthCare.gov — Special Enrollment Periods', url: 'https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/' }
    ]
  },
  {
    slug: 'special-enrollment-period', context: 'special_enrollment', eyebrow: 'Enrollment timing guide',
    title: 'Special Enrollment Periods in Florida', metaTitle: 'Florida Special Enrollment Period Guide (2026)',
    description: 'See which life changes may open a Florida Marketplace Special Enrollment Period, common 60-day deadlines, and what proof may be required.',
    quickAnswer: 'A Special Enrollment Period lets you enroll outside annual Open Enrollment after certain life changes. Common examples include losing qualifying coverage, moving, marriage, birth or adoption. The deadline and coverage start date depend on the event.',
    cardSummary: 'Understand qualifying events, deadlines, proof and coverage effective dates.', cta: 'Check My Timing',
    sections: [
      { heading: 'Common events that may qualify', paragraphs: ['HealthCare.gov lists loss of qualifying coverage, changes in household, qualifying moves and certain other circumstances. The details matter. A move made only for medical treatment or vacation does not qualify, and voluntarily cancelling some coverage does not create an enrollment right.'], bullets: ['Loss of employer, parent, individual, Medicaid or CHIP coverage', 'Marriage, birth, adoption or foster placement', 'A qualifying move to a new ZIP code or county', 'Divorce or death when it causes a coverage loss', 'Certain citizenship, incarceration-release and exceptional circumstances'] },
      { heading: 'Most windows are short', paragraphs: ['Many events use a 60-day window. Loss of qualifying coverage can be handled before or after the loss, while people who lost Medicaid or CHIP may have up to 90 days after the loss. Event-specific rules determine the effective date.', 'Apply as soon as you know coverage will end. Waiting until the final days leaves less time to resolve document requests or make the first premium payment.'] },
      { heading: 'Verification is especially important in 2026', paragraphs: ['The federal Marketplace is verifying eligibility for many Special Enrollment Period enrollments before coverage. Keep official documents showing the event date, previous coverage and who was affected. The Marketplace eligibility notice will say what to upload and by when.', 'HealthCoveragePath can help organize your situation, but only the Marketplace or another authorized enrollment entity determines eligibility.'] },
      { heading: 'Open Enrollment is separate', paragraphs: ['For 2026 HealthCare.gov coverage, Open Enrollment ran November 1, 2025 through January 15, 2026. Outside that period, you need a Special Enrollment Period or another program such as Medicaid or CHIP. HealthCare.gov has announced that Open Enrollment for 2027 coverage starts November 1.'] }
    ],
    faqs: [
      { question: 'Is low income alone a year-round Special Enrollment Period in 2026?', answer: 'No. CMS removed the monthly Special Enrollment Period based only on projected income at or below 150% of the federal poverty level for plan year 2026.' },
      { question: 'What happens if I cannot prove my event?', answer: 'HealthCare.gov may deny the Special Enrollment Period. Follow the eligibility notice and document deadline; appeal rights may be available.' },
      { question: 'Does moving within Florida qualify?', answer: 'A move to a new ZIP code or county may qualify if other conditions are met. A temporary stay or move only for medical treatment does not.' },
      { question: 'Can I apply before coverage ends?', answer: 'For an expected loss of qualifying coverage, the window can begin 60 days before the loss.' }
    ],
    sources: [
      { label: 'HealthCare.gov — Special Enrollment Periods', url: 'https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/' },
      { label: 'HealthCare.gov — Special circumstances list', url: 'https://www.healthcare.gov/sep-list/' },
      { label: 'CMS — 2025 Marketplace Integrity and Affordability Final Rule', url: 'https://www.cms.gov/newsroom/fact-sheets/2025-marketplace-integrity-and-affordability-final-rule' }
    ]
  },
  {
    slug: 'health-insurance-without-a-job', context: 'unemployed', eyebrow: 'Coverage without employment',
    title: 'Health Insurance Without a Job in Florida', metaTitle: 'Health Insurance Without a Job in Florida (2026)',
    description: 'Compare Marketplace, COBRA, spouse coverage, Medicaid and Florida KidCare when you are unemployed or between jobs in Florida.',
    quickAnswer: 'You do not need a job to buy Marketplace health insurance. Eligibility for savings depends on household size, expected annual household income and access to other qualifying coverage—not employment status alone.',
    cardSummary: 'Options for unemployed Floridians, people between jobs and households with no employer offer.', cta: 'Check My Options',
    sections: [
      { heading: 'Unemployment does not block Marketplace coverage', paragraphs: ['HealthCare.gov states that unemployed people can apply through the Marketplace. One application also checks for Medicaid or CHIP. A loss of job-based coverage may create a Special Enrollment Period even when annual Open Enrollment is closed.', 'If you were already uninsured, becoming unemployed alone may not be a qualifying event. Check whether you lost qualifying coverage or had another listed life change.'] },
      { heading: 'Income can be more complicated than a paycheck', paragraphs: ['Marketplace savings use expected household income for the entire year. Include earlier wages, unemployment compensation and other income that the Marketplace application requires. Savings are not based only on current monthly income.', 'Florida has limited Medicaid eligibility for adults and has not adopted ACA adult expansion. Very low income does not automatically mean an adult qualifies for either Medicaid or a Marketplace premium tax credit. Apply for an official determination.'] },
      { heading: 'Compare every household member', paragraphs: ['Children may qualify for Medicaid or Florida KidCare even when adults use Marketplace coverage. A spouse may have an employer plan. Split coverage can be a practical outcome when eligibility differs by person.', 'Also compare COBRA if a recent employer offered it. It can be expensive, but it preserves the former plan’s network and deductible progress.'] },
      { heading: 'Avoid coverage that only looks comprehensive', paragraphs: ['Some products marketed to unemployed people are limited-benefit or short-term coverage rather than ACA-compliant major medical insurance. Read exclusions, pre-existing-condition rules, maximum benefits, prescription coverage and renewal terms before buying.'] }
    ],
    faqs: [
      { question: 'Can I get Obamacare with no job?', answer: 'Yes. Employment is not required. Marketplace savings depend on projected household income and other eligibility rules.' },
      { question: 'Can I enroll anytime because I am unemployed?', answer: 'Not necessarily. Outside Open Enrollment, a qualifying event such as losing job-based coverage may be required.' },
      { question: 'Can an adult with no income get Florida Medicaid?', answer: 'Florida Medicaid eligibility depends on more than income, including category and household circumstances. Florida has not adopted the ACA adult Medicaid expansion.' },
      { question: 'Does unemployment compensation count as income?', answer: 'Marketplace applications generally include taxable unemployment compensation in the annual household-income estimate. Follow current HealthCare.gov instructions for your application.' }
    ],
    sources: [
      { label: 'HealthCare.gov — Coverage for unemployed people', url: 'https://www.healthcare.gov/unemployed/coverage/' },
      { label: 'HealthCare.gov — Income that counts', url: 'https://www.healthcare.gov/income-and-household-information/income/' },
      { label: 'Florida DCF — Medicaid', url: 'https://www.myflfamilies.com/services/public-assistance/medicaid' }
    ]
  }
];

export const getFloridaPage = (slug: string) => floridaPages.find((page) => page.slug === slug);
