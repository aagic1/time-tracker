export type ResponseIssue = {
  source: string;
  reason: string;
};

export type ValidationIssue = {
  message: string;
  path: (string | number)[];
};
