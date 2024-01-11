import { delay } from "@common/index";
import { showBanner, showHeist } from "./examples";

on("onClientResourceStart", async (name: string) => {
  if (name != GetCurrentResourceName()) return;

  await delay(1000);

  const [celebration, celebration_bg, celebration_fg] = await showHeist(
    {
      missionTextLabel: "BANK HEIST",
      passFailTextLabel: "PASSED.",
      messageLabel: "",
    },
    [
      // ["Total Payout", "~w~$50000"],
      // ["value3", "~w~$50000"],
      // ["value2", "~w~1999"],
      // ["value1", "~w~TEST"],
    ],
    {
      startMoney: 0,
      finishMoney: 5000000,
      topText: "Your take",
      bottomText: "",
      rightHandStat: "",
      rightHandStatIcon: 3,
    },
    {
      xpGained: 50000,
      xpBeforeGain: 1400,
      minLevelXP: 600,
      maxLevelXP: 2360,
      currentRank: 68,
      nextRank: 69,
      rankTextSmall: "",
      rankTextBig: "LEVEL UP.",
    }
  );

  setTick(async () => {
    DrawScaleformMovieFullscreenMasked(
      celebration_bg,
      celebration_fg,
      255,
      255,
      255,
      255
    );
    DrawScaleformMovieFullscreen(celebration, 255, 255, 255, 255, 0);
  });
});

export async function requestScaleform(scaleformName: string): Promise<number> {
  const handle = RequestScaleformMovie(scaleformName);
  while (!HasScaleformMovieLoaded(handle)) {
    await delay(0);
  }
  return handle;
}

export async function callScaleformFunction(
  scaleformHandle: number,
  doReturnData: boolean,
  scaleformName: string,
  ...args: any[]
): Promise<void | number> {
  BeginScaleformMovieMethod(scaleformHandle, scaleformName);
  if (args.length <= 0) {
    EndScaleformMovieMethod();
    return;
  }
  args.forEach((arg) => {
    const argType = typeof arg;
    switch (argType) {
      case "number":
        ScaleformMovieMethodAddParamInt(arg);
        break;
      case "boolean":
        ScaleformMovieMethodAddParamBool(arg);
        break;
      case "string":
        ScaleformMovieMethodAddParamTextureNameString(arg);
        break;
    }
  });
  if (doReturnData) {
    return EndScaleformMovieMethodReturnValue();
  } else {
    EndScaleformMovieMethod();
    return;
  }
}
