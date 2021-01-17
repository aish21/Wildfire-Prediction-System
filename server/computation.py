# -*- coding: utf-8 -*-
"""python_ml_final

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1TDPL0LrmI8FZaxd3l_AyOijImFbJvZVb
"""

from flask import Flask, render_template, send_from_directory
import numpy as np
import pandas as pd
import tensorflow as tf
import json

import cv2

def color_weight_pred(filename):
  model = tf.keras.models.load_model('colormodel_trained_89.h5')
  model.summary()
  img = cv2.imread(filename)
  img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
  h, w, c = img.shape
  hs = round(h/11)
  ws = round(w/11)
  resized = cv2.resize(img, (ws,hs), interpolation = cv2.INTER_AREA)
  #new_resized = cv2.resize(resized, (ws*10,hs*10), interpolation = cv2.INTER_AREA)
  # cv2.imshow('new image', new_resized)
  
  a = []
  # for j in range(ws):
  #   for i in range(hs):
  #     a.append(resized[i,j])
  #nparray = np.array(a)
  #b = nparray.reshape(hs, ws) 
  #np.flipud(b)
  #np.fliplr(b)
  
  for i in range(hs):  
    for j in range(ws):  
      a.append(resized[i,j])
  #nparray = b.reshape(1, hs*ws)
  #a = list(nparray)
  hex_list = []
  hex_conv = '#%02x%02x%02x'                           
  for x in a:
    tuple_color = tuple(x)
    hex_list.append(hex_conv % tuple_color)
    
  print(hex_list)

  new_resized_df = pd.DataFrame(a, columns=['red', 'green', 'blue'])
  color = model.predict(new_resized_df)
  bin_col = np.argmax(color, axis=1)
  weights = []
  for i in range(len(bin_col)):
    if bin_col[i]==1:
      g_percent = new_resized_df.loc[i, 'green']/(int(new_resized_df.loc[i, 'green']) + new_resized_df.loc[i, 'blue'] + new_resized_df.loc[i, 'red'])
      g_percent = g_percent * 100
      weights.append(g_percent-30)
    elif bin_col[i]==7:
      g_percent = 55
      weights.append(g_percent)
    elif bin_col[i]==2:
      g_percent = 100
      weights.append(g_percent)
    else:
      g_percent = 80
      weights.append(g_percent)
  print(len(weights))
  #x = np.reshape(weights, (hs, ws))
  str1 = ' '.join(str(e) for e in weights)
  with open('data.txt', 'w') as outfile:
    json.dump(weights, outfile)
  
  with open('colors.txt', 'w') as outfile:
    json.dump(hex_list, outfile)

  # cv2.waitKey(0)
  # cv2.destroyAllWindows()

  return "Successful"