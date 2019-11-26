import asyncio
import websockets
import time
import signal
import sys
import readchar


mapping = {
    '1': '55',
    '2': '57',
    '3': '59',
    '4': '60',
    '5': '62',
    '6': '64',
    '7': '65',
    '8': '67',
    '9': '69',
    '0': '71'
}


def sig_handler(signum, frame):
    sys.exit()


def start():
    async def hello(websocket, path):
        while True:
            a = readchar.readkey()
            if a not in mapping.keys():
                sys.exit()
            await websocket.send(mapping[a])

    start_server = websockets.serve(hello, "0.0.0.0", 8765)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


def main():
    signal.signal(signal.SIGINT, sig_handler)
    start()


if __name__ == "__main__":
    main()
