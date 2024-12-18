import * as v from "valibot";

export type StaticRoute = { path: string };

export type DynamicRoute = {
  path: string;
  paramsSchema: v.ObjectSchema<
    v.ObjectEntries,
    v.ErrorMessage<v.ObjectIssue> | undefined
  >;
};

type Route = StaticRoute | DynamicRoute;

const pageSchema = v.pipe(
  v.unknown(),
  v.transform(Number),
  v.number(),
  v.integer(),
);

export const routes = {
  홈: {
    path: "/",
    paramsSchema: v.object({
      page: v.optional(pageSchema),
    }),
  },
  "소스페소-발행": {
    path: "/sospeso/issuing",
  },
  "소스페소-결제": {
    path: "/payment/[paymentId]",
    paramsSchema: v.object({
      paymentId: v.string(),
    }),
  },
  "소스페소-상세": {
    path: "/sospeso/[sospesoId]",
    paramsSchema: v.object({
      sospesoId: v.pipe(v.string(), v.nanoid()),
    }),
  },
  "소스페소-신청": {
    path: "/sospeso/[sospesoId]/application",
    paramsSchema: v.object({
      sospesoId: v.string(),
    }),
  },
  어드민: {
    path: "/admin",
  },
  "어드민-소스페소-사용": {
    path: "/admin/sospeso/[sospesoId]/consuming",
    paramsSchema: v.object({
      sospesoId: v.string(),
      consumerId: v.string(),
    }),
  },
  "가짜-이메일-인박스": {
    path: "/admin/email/inbox",
    paramsSchema: v.object({
      emailAddress: v.pipe(v.string(), v.email()),
    }),
  },
  로그인: {
    path: "/auth/login",
    paramsSchema: v.object({
      error: v.optional(v.picklist(["email_not_found"])),
    }),
  },
  "비밀번호-변경-이메일": {
    path: "/auth/change-password",
    paramsSchema: v.object({}),
  },
  "비밀번호-변경하기": {
    path: "/auth/reset-password",
    paramsSchema: v.object({}),
  },
  회원가입: {
    path: "/auth/signup",
    paramsSchema: v.object({
      email: v.optional(v.pipe(v.string(), v.email())),
    }),
  },
  "회원가입-이메일-전송-완료": {
    path: "/auth/signup/sent",
    paramsSchema: v.object({
      email: v.pipe(v.string(), v.email()),
    }),
  },
  "소스페소-신청완료": {
    path: "/sospeso/applicationSuccess",
  },
  "파라미터-테스트": {
    path: "/test/[testId]",
    paramsSchema: v.object({
      testId: v.string(),
      q: v.string(),
    }),
  },
} satisfies Record<string, Route>;

export function resolveRoute<RouteKey extends RouteKeys>(
  key: RouteKey,
): (typeof routes)[RouteKey] {
  return routes[key];
}

export type RouteKeys = keyof typeof routes;

export type RouteParams<RouteKey extends RouteKeys> =
  (typeof routes)[RouteKey] extends DynamicRoute
    ? v.InferOutput<(typeof routes)[RouteKey]["paramsSchema"]>
    : undefined;
