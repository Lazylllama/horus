import "@1771technologies/lytenyte-core/design.css";
import "@1771technologies/lytenyte-core/shadcn.css";
import "@1771technologies/lytenyte-core/grid.css";
import { Grid } from "@1771technologies/lytenyte-core";

export function LyteNyte<Spec extends Grid.GridSpec>(
  props: Grid.Props<Spec> &
    (undefined extends Spec["api"]
      ? unknown
      : {
          apiExtension:
            | ((incomplete: Grid.API<Spec>) => Spec["api"] | null)
            | Spec["api"];
        }),
) {
  return (
    <div className="ln-grid ln-shadcn h-full w-full">
      <Grid {...props} />
    </div>
  );
}
