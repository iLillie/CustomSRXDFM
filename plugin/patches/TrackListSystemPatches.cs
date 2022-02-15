using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Text;
using BestHTTP.SocketIO;
using BestHTTP.SocketIO.Events;
using SpinUtility;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;
using XD;

namespace CustomSRXDFM.Patches
{
  class TrackListSystemPatches
  {
    [HarmonyPatch(typeof(TrackListSystem))]
    [HarmonyPatch("PrimaryTrackList", MethodType.Getter)]
    [HarmonyPostfix]
    static void TrackListSystem_getPrimaryTrackList_Postfix(TrackListSystem __instance, ref TrackList __result)
    {
      __result = __instance.CustomTrackList;
    }

    [HarmonyPatch(typeof(TrackListSystem))]
    [HarmonyPatch("RadioMenuTrackList", MethodType.Getter)]
    [HarmonyPostfix]
    static void TrackListSystem_getRadioTrackList_Postfix(TrackListSystem __instance, ref TrackList __result)
    {
      __result = __instance.CustomTrackList;
    }
  }
}