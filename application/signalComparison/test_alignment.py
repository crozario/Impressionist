"""
This file tests signal alignment using sine waves
(don't delete)
"""

import numpy as np
import matplotlib.pyplot as plt
from modifySignals import alignSignals

one = np.arange(0, 2*np.pi, 0.01)
one = one.reshape(1, len(one))
two = np.arange(np.pi / 2.0, 5*np.pi/2.0, 0.01)
two = two.reshape(1, len(two))

sin1 = np.sin(one).reshape(1, one.size)
sin2 = np.sin(two).reshape(1, two.size)

sin1 = np.append(one, sin1, axis=0)
sin2 = np.append(two, sin2, axis=0)

plt.ion()
# sin1, sin2 = alignSignals(sin1, sin2, 1, plot=True)
# exit()

# print(sin1.shape)
# print(sin1)
# exit()

plt.subplot(2,1,1)
plt.plot(sin1[1])
plt.plot(sin2[1])
plt.legend(['1', '2'])

plt.subplot(2,1,2)
sin1, sin2 = alignSignals(sin1, sin2, 1, plot=False)
plt.plot(sin1[1])
plt.plot(sin2[1])
plt.legend(['1', '2'])

plt.show()
input("press [enter] to exit")
plt.clf()
plt.close()
