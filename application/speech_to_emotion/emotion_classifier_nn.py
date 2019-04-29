
# !git clone https://github.com/marcogdepinto/Emotion-Classification-Ravdess.git

# from google.colab import drive
# drive.mount('/gdrive')

# %cd /gdrive/'My Drive'/'Colab Notebooks'/
# !ls

# !mv /gdrive/'My Drive'/'Colab Notebooks'/pretending-to-be-happy.wav /content

# %cd /content/

#!ffmpeg -i /gdrive/'My Drive'/'Colab Notebooks'/opensmile.wav -ab 160k -ac 2 -ar 44100 -vn opensmile.wav

import keras
import numpy as np
import librosa

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

class livePredictions:

    def __init__(self, path, file):

        self.path = path
        self.file = file

    def load_model(self):
        '''
        I am here to load you model.
        :param path: path to your h5 model.
        :return: summary of the model with the .summary() function.
        '''
        self.loaded_model = keras.models.load_model(self.path)
        # return self.loaded_model.summary()

    def makepredictions(self):
        '''
        I am here to process the files and create your features.
        '''
        data, sampling_rate = librosa.load(self.file)
        mfccs = np.mean(librosa.feature.mfcc(y=data, sr=sampling_rate, n_mfcc=40).T, axis=0) 
        x = np.expand_dims(mfccs, axis=2)
        x = np.expand_dims(x, axis=0)
        predictions = self.loaded_model.predict_classes(x)
        emotion = self.convertclasstoemotion(predictions)
        # print( "Prediction is", " ", emotion)
        return emotion

    def convertclasstoemotion(self, pred):
        '''
        I am here to convert the predictions (int) into human readable strings.
        '''
        self.pred  = pred

        if pred == 0:
            pred = "neutral"
            return pred
        elif pred == 1:
            pred = "calm"
            return pred
        elif pred == 2:
            pred = "happy"
            return pred
        elif pred == 3:
            pred = "sad"
            return pred
        elif pred == 4:
            pred = "angry"
            return pred
        elif pred == 5:
            pred = "fearful"
            return pred
        elif pred == 6:
            pred = "disgust"
            return pred
        elif pred == 7:
            pred = "surprised"
            return pred

# Here you can replace path and file with the path of your model and of the file from the RAVDESS dataset you want to use for the prediction,
# Below, I have used a neutral file: the prediction made is neutral.

if __name__ == "__main__":
    modelFile = os.path.join(os.path.dirname(
        os.path.realpath(__file__)), 'Emotion_Voice_Detection_Model.h5')
    pred = livePredictions(path= modelFile,
                        file='pretending-to-be-happy.wav')
    pred.load_model()
    pred.makepredictions()
