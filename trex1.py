import mss.tools as tools
import pyscreenshot as ImageGrab
import pyautogui
import time
import numpy as np
import cv2

from mss import mss, tools
from PIL import ImageOps, Image

cactus_box = {'left': 82 + 65, 'top': 248 - 25, 
            'width': 500, 'height': 200}
sct = mss()
print("screenshot")
img = sct.grab(cactus_box)
tools.to_png(img.rgb, img.size, output='sr.png')
#####
# SOME CONSTANTS
BLANK_BOX = 247000
GAMEOVER_RANGE = [10000, 27000]
TIME_BETWEEN_FRAMES = .01
TIME_BETWEEN_GAMES = .5
LINE_START_Y = 248 #temp value
LINE_START_X = 115 #temp value
OFFSET_TREX_X = 68 + 20
OFFSET_TREX_Y = 25
OFFSET_RELOAD_X = 220
OFFSET_RELOAD_Y = 55


class Cordinates(object):
    """docstring for Cordinates"""
    # replay_pos = (390, 410)
    replay_pos = (520, 390)

def restart_game():
    pyautogui.click(Cordinates.replay_pos)

def press_up():
    pyautogui.keyUp("down")
    pyautogui.keyDown("up") # press a key down
    time.sleep(0.02)
    print("Jump")
    pyautogui.keyUp("up") # release a key
    pyautogui.keyDown("down")
def calc_color_value(box):
    sct = mss()
    img = np.array(sct.grab(box))[:,:,:3]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return gray.sum()

def check_catus():
    cactus_box = {'left': LINE_START_X + OFFSET_TREX_X, 'top': LINE_START_Y - OFFSET_TREX_Y, 
                  'width': 50, 'height': 20}
    sct = mss()
    img = np.array(sct.grab(cactus_box))[:,:,:3]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    print (gray.sum())
    return gray.sum()
def calc_line():
    done = False
    i = 200
    sum = 0
    index = 0
    while(not done):
        box = {'left': 400, 'top': i, 
                  'width': 50, 'height': 1}
        _sum = calc_color_value(box)
        if i == 200:
            sum = _sum
        if _sum < sum :
            sum = _sum
            index = i
        i += 1
        done = True if i >= 300 else False
    return index
def calc_start_x():
    done = False
    i = 50
    sum = 0
    index = 0
    while(not done):
        box = {'left': i, 'top': LINE_START_Y, 
                  'width': 1, 'height': 1}
        _sum = calc_color_value(box)
        # print (sum, _sum, box)
        if i == 50:
            sum = _sum
        if _sum < sum :
            sum = _sum
            index = i
        i += 1
        done = True if i >= 500 else False
    return index
def setup():
    global LINE_START_Y
    global LINE_START_X
    LINE_START_Y = calc_line()
    LINE_START_X = calc_start_x()
    print('LINE_START_Y: ', LINE_START_Y)
    print('LINE_START_X: ', LINE_START_X)
def check_gameover(gameover_range = GAMEOVER_RANGE):
    result = False
    # gameover_box = {'left': 290, 'top': 360, 
    #               'width': 200, 'height': 15}
    gameover_box = {'left': LINE_START_X + OFFSET_RELOAD_X, 'top': LINE_START_Y - OFFSET_RELOAD_Y, 
                  'width': 35, 'height': 35}
    # sct = mss()
    # img = np.array(sct.grab(gameover_box))[:,:,:3]
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    curr_state = calc_color_value(gameover_box)
    # print('CHECK', curr_state, gameover_box, LINE_START_X, OFFSET_RELOAD_X)
    if curr_state < GAMEOVER_RANGE[1] and curr_state > GAMEOVER_RANGE[0]:
        result = True
    return result

def main():
    print('Program started')
    setup()
    while True:
        gameover_state = check_gameover()
        if gameover_state:
            time.sleep(TIME_BETWEEN_GAMES)
            print("Game over. Restart game")
            restart_game()
        cactus_state = check_catus()
        if cactus_state != BLANK_BOX:
            press_up()
        time.sleep(TIME_BETWEEN_FRAMES)

if __name__ == '__main__':
    main()
