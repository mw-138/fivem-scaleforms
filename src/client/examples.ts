import { requestScaleform, callScaleformFunction } from ".";

export async function showBanner(
  _text1: string,
  _text2: string
): Promise<number> {
  const scaleform = await requestScaleform("MP_BIG_MESSAGE_FREEMODE");

  await callScaleformFunction(
    scaleform,
    false,
    "SHOW_SHARD_CENTERED_MP_MESSAGE"
  );
  await callScaleformFunction(
    scaleform,
    false,
    "SHARD_SET_TEXT",
    _text1,
    _text2,
    0
  );

  return scaleform;
}

export async function showHeist(
  initialText: any,
  table: string[][],
  money: any,
  xp: any
): Promise<number[]> {
  const celebration = await requestScaleform("HEIST_CELEBRATION");
  const celebration_bg = await requestScaleform("HEIST_CELEBRATION_BG");
  const celebration_fg = await requestScaleform("HEIST_CELEBRATION_FG");

  const scaleforms = [celebration, celebration_bg, celebration_fg];

  scaleforms.forEach(async (scaleform) => {
    await callScaleformFunction(
      scaleform,
      false,
      "CREATE_STAT_WALL",
      1,
      "HUD_COLOUR_FREEMODE_DARK",
      1
    );
    await callScaleformFunction(
      scaleform,
      false,
      "ADD_BACKGROUND_TO_WALL",
      1,
      80,
      1
    );
    await callScaleformFunction(
      scaleform,
      false,
      "ADD_MISSION_RESULT_TO_WALL",
      1,
      initialText.missionTextLabel,
      initialText.passFailTextLabel,
      initialText.messageLabel,
      true,
      true,
      true
    );

    if (table.length > 0) {
      await callScaleformFunction(scaleform, false, "CREATE_STAT_TABLE", 1, 10);

      table.forEach(async (entry) => {
        const [label, cash] = entry;
        await callScaleformFunction(
          scaleform,
          false,
          "ADD_STAT_TO_TABLE",
          1,
          10,
          label,
          cash,
          true,
          true,
          false,
          false,
          0
        );
      });

      await callScaleformFunction(
        scaleform,
        false,
        "ADD_STAT_TABLE_TO_WALL",
        1,
        10
      );
    }

    if (money.startMoney !== money.finishMoney) {
      await callScaleformFunction(
        scaleform,
        false,
        "CREATE_INCREMENTAL_CASH_ANIMATION",
        1,
        20
      );
      await callScaleformFunction(
        scaleform,
        false,
        "ADD_INCREMENTAL_CASH_WON_STEP",
        1,
        20,
        money.startMoney,
        money.finishMoney,
        money.topText,
        money.bottomText,
        money.rightHandStat,
        money.rightHandStatIcon,
        0
      );
      await callScaleformFunction(
        scaleform,
        false,
        "ADD_INCREMENTAL_CASH_ANIMATION_TO_WALL",
        1,
        20
      );
    }

    if (xp.xpGained !== 0) {
      await callScaleformFunction(
        scaleform,
        false,
        "ADD_REP_POINTS_AND_RANK_BAR_TO_WALL",
        1,
        xp.xpGained,
        xp.xpBeforeGain,
        xp.minLevelXP,
        xp.maxLevelXP,
        xp.currentRank,
        xp.nextRank,
        xp.rankTextSmall,
        xp.rankTextBig
      );
    }

    await callScaleformFunction(scaleform, false, "SHOW_STAT_WALL", 1);
    await callScaleformFunction(scaleform, false, "createSequence", 1, 1, 1);
  });

  StartScreenEffect("HeistCelebToast", 0, true);
  // PlaySoundFrontend(-1, "Oneshot_Final", "MP_MISSION_COUNTDOWN_SOUNDSET", true);

  return [celebration, celebration_bg, celebration_fg];
}
