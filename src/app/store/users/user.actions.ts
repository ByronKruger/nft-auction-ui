import { createAction, props } from "@ngrx/store";
import { UserLogin } from '../../_models/user.model';

export const getUsers = createAction(
    '[Users] Get Users'
);

export const authUser = createAction(
    '[Users] Get Users',
    props<{userLogin: UserLogin}>()
);