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
  class RadioSocketPatches
  {
    [HarmonyPatch(typeof(RadioSocket))]
    [HarmonyPatch("ServerUrl", MethodType.Getter)]
    [HarmonyPostfix]
    static void RadioSocket_get_ServerUrl_Postfix(ref string __result)
    {
      __result = "http://127.0.0.1:3000";
    }
  }
}