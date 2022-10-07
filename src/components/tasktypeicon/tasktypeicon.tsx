import { ReactComponent as SelectColumnsIcon } from "../../assets/icons/type_new.svg";
import { ReactComponent as ComputeIcon } from "../../assets/icons/type_field_compute_task.svg";
import { ReactComponent as FilterIcon } from "../../assets/icons/type_fitler_task.svg";
import { ReactComponent as GroupByIcon } from "../../assets/icons/type_group_by.svg";
import { ReactComponent as JoinIcon } from "../../assets/icons/type_join_task.svg";
import { ReactComponent as SqlIcon } from "../../assets/icons/type_sql_task.svg";
import { ReactComponent as TableIcon } from "../../assets/icons/type_table_dtype.svg";
import { ReactComponent as RecipeIcon } from "../../assets/icons/type_recipe.svg";
import { TaskTypes } from "../../services/taskTypeHelper";
export interface TaskTypeIconProps {
    taskType:string;
    className: string;
}
export default function TaskTypeIcon(props:TaskTypeIconProps) {
    let rslt;
    switch (props.taskType) {
        case TaskTypes.TaskSelectColumns:
            rslt = <SelectColumnsIcon className={props.className}/>;
            break;
        case TaskTypes.TaskFieldComplete:
            rslt = <ComputeIcon className={props.className}/>;
            break;
        case TaskTypes.TaskFilter:
            rslt = <FilterIcon className={props.className}/>;
            break;
        case TaskTypes.TaskGroupBy:
            rslt = <GroupByIcon className={props.className}/>;
            break;
        case TaskTypes.TaskJoin:
            rslt = <JoinIcon className={props.className}/>;
            break;
        case TaskTypes.TaskSQLSelect:
            rslt = <SqlIcon className={props.className}/>;
            break;
        case TaskTypes.TaskPersistent:
            rslt = <TableIcon className={props.className}/>;
            break;
        case TaskTypes.TaskRecipe:
            rslt = <RecipeIcon className={props.className}/>;
            break;
        default:
            rslt = null;
            break;
    }

    return rslt;
}