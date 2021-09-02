export const state: {
  user?: {
    id: string;
    name: string;
    email: string;
  };
} = {};

export type State = typeof state;
