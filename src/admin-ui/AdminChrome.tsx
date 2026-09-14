import type { ReactNode } from "react";
import type { AdminViewServerProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";

interface AdminChromeProps {
  serverProps: AdminViewServerProps;
  children: ReactNode;
}

export function AdminChrome({ serverProps, children }: AdminChromeProps) {
  const { initPageResult, params, searchParams, payload } = serverProps;

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={payload}
      permissions={initPageResult.permissions}
      req={initPageResult.req}
      searchParams={searchParams}
      user={initPageResult.req.user ?? undefined}
      visibleEntities={initPageResult.visibleEntities}
      viewType="dashboard"
    >
      {children}
    </DefaultTemplate>
  );
}
