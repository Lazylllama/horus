import { getSettingsData } from "@/app/actions/settings";
import { SettingsClient } from "@/components/settings/settings-client";

export default async function SettingsPage() {
  const data = await getSettingsData();
  return <SettingsClient data={data} />;
}
