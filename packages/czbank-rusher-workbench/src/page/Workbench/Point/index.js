import Framework from './Framework';
import History from './History';
import Overview from './Overview';

import AdjustmentActivity from './Adjustment/Activity';
import AdjustmentManual from './Adjustment/Manual';
import AdjustmentPlan from './Adjustment/Plan';
import AdjustmentPlanVariation from './Adjustment/PlanVariation';
import AdjustmentPlanPresent from './Adjustment/Present';

export default {
	Framework,
	History,
	Overview,
	Adjustment: {
		Activity: AdjustmentActivity,
		Manual: AdjustmentManual,
		Plan: AdjustmentPlan,
		PlanVariation: AdjustmentPlanVariation,
		Present: AdjustmentPlanPresent
	}
};
