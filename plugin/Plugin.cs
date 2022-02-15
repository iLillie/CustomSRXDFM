using BepInEx;
using HarmonyLib;
using CustomSRXDFM.Patches;

namespace CustomSRXDFM
{
    [BepInPlugin(PluginInfo.PLUGIN_GUID, PluginInfo.PLUGIN_NAME, PluginInfo.PLUGIN_VERSION)]
    public class Plugin : BaseUnityPlugin
    {
        private void Awake()
        {
            var harmony = new Harmony(PluginInfo.PLUGIN_GUID);
             harmony.PatchAll(typeof(RadioSocketPatches));
             harmony.PatchAll(typeof(TrackListSystemPatches));
            // Plugin startup logic
            Logger.LogInfo($"Plugin {PluginInfo.PLUGIN_GUID} is loaded!");
        }
    }
}
