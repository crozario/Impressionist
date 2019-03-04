# Comparison of two speech features for similarity

> *Comparison using Dynamic Time Warping and ML coming soon.*

## To run:
```bash
# this aligns features using cross-correlation and checks similarity using pearson correllation coefficient
python3 compareSig.py ../test-data/features/prosodyShs_opensmile.csv ../test-data/features/prosodyShs_haardopensmile.csv prosody
```
- For help run:
```bash
python3 compareSig.py -h
```

## Install dependencies
```bash
pip install numpy scipy matplotlib
```
- Don't know which versions are required, but these are the versions I'm using:
```
matplotlib               3.0.3     
numpy                    1.16.2    
scipy                    1.2.1     
```
- Finally Python version I'm using is : **3.6.3**