import { delay } from "@common/index";
import { showBanner, showHeist } from "./examples";

on("onClientResourceStart", async (name: string) => {
  if (name != GetCurrentResourceName()) return;

  await delay(1000);

  const [celebration, celebration_bg, celebration_fg] = await showHeist(
    {
      missionTextLabel: "~y~BANK HEIST~s~",
      passFailTextLabel: "PASSED.",
      messageLabel: "",
    },
    [
      ["Total Payout", "~g~$~s~50000"],
      ["value3", "~g~$~s~50000"],
      ["value2", "~b~1999~s~"],
      ["value1", "TEST"],
    ],
    {
      startMoney: 3000,
      finishMoney: 5000000,
      topText: "",
      bottomText: "",
      rightHandStat: "woah",
      rightHandStatIcon: 0,
    },
    {
      xpGained: 50000,
      xpBeforeGain: 1400,
      minLevelXP: 600,
      maxLevelXP: 2360,
      currentRank: 68,
      nextRank: 69,
      rankTextSmall: "LEVEL UP.",
      rankTextBig: "~b~Nice.~s~",
    }
  );

  // const handle = await requestScaleform("HUD_MP_CASH");
  // await callScaleformFunction(handle, "SET_PLAYER_MP_CASH", false, 500);
  // await callScaleformFunction(handle, "READY", false, 0);

  setTick(async () => {
    // DrawScaleformMovieFullscreen(handle, 255, 255, 255, 255, 0);
    DrawScaleformMovieFullscreenMasked(
      celebration_bg,
      celebration_fg,
      255,
      255,
      255,
      50
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
