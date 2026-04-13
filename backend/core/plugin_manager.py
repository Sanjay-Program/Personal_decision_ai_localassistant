import os
import importlib.util
from typing import List, Dict, Any

class BasePlugin:
    def __init__(self):
        self.name = "BasePlugin"
        self.description = "Base class for all plugins"
        self.enabled = True

    def execute(self, action: str, **kwargs):
        raise NotImplementedError("Plugins must implement execute()")

    def get_tools(self) -> List[Dict[str, Any]]:
        return []

class PluginManager:
    def __init__(self, plugin_dir: str):
        self.plugin_dir = plugin_dir
        self.plugins: Dict[str, BasePlugin] = {}

    def load_plugins(self):
        if not os.path.exists(self.plugin_dir):
            os.makedirs(self.plugin_dir)
            return

        for filename in os.listdir(self.plugin_dir):
            if filename.endswith(".py") and not filename.startswith("__"):
                plugin_name = filename[:-3]
                file_path = os.path.join(self.plugin_dir, filename)
                
                spec = importlib.util.spec_from_file_location(plugin_name, file_path)
                if spec and spec.loader:
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)
                    
                    # Look for a class that inherits from BasePlugin
                    for attr_name in dir(module):
                        attr = getattr(module, attr_name)
                        if (isinstance(attr, type) and 
                            issubclass(attr, BasePlugin) and 
                            attr is not BasePlugin):
                            self.plugins[plugin_name] = attr()
                            print(f"Loaded plugin: {plugin_name}")

    def get_all_tools(self) -> List[Dict[str, Any]]:
        all_tools = []
        for plugin in self.plugins.values():
            if plugin.enabled:
                all_tools.extend(plugin.get_tools())
        return all_tools

    def execute_plugin(self, plugin_name: str, action: str, **kwargs):
        if plugin_name in self.plugins and self.plugins[plugin_name].enabled:
            return self.plugins[plugin_name].execute(action, **kwargs)
        return f"Plugin {plugin_name} not found or disabled."

plugin_manager = PluginManager(os.path.join(os.path.dirname(os.path.dirname(__file__)), "plugins"))
