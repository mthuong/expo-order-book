import { useDispatch } from "react-redux";

let _dispatch: ReturnType<typeof useDispatch> | undefined = undefined;

export const setDispatcher = (dispatch: ReturnType<typeof useDispatch>) => {
  _dispatch = dispatch;
};

export const globalDispatch = (actions: any) => {
  _dispatch?.(actions);
};
