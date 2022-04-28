# csgoWarmupTime

App to display the remaining time from warmup phase in csgo.

Not configured for iOS.

Local IP needs to be added in App.tsx line 44.

For the server part i used a small phython programm using websockets to communicate with my app:
```python
import pytesseract
import pyautogui
import asyncio
import websockets

pytesseract.pytesseract.tesseract_cmd="" #path to tesseract.exe e.g. "C:/Tesseract/tesseract.exe"

async def getDataLoop(websocket):
    print("connected!")
    while (True):
        try:
            screenshot = pyautogui.screenshot(region=(760, 310, 410, 40))
            res = pytesseract.image_to_string(screenshot, lang="eng")
            print(res)
            await websocket.send(res)
            
        except websockets.exceptions.ConnectionClosed:
            print("disconnected!")
            break
        
        await asyncio.sleep(0.5)

startServer = websockets.serve(getDataLoop, "", 2211) #add local ip address in ""

asyncio.get_event_loop().run_until_complete(startServer)
asyncio.get_event_loop().run_forever()
```
Note: Tesseract needs to be installed and the path added
