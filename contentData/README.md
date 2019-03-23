# Content Database

## Hierarchical Structure
> VERY important to follow this to ensure seemless extraction of features and saving to database

HOME = `Impressionist/`

CONTENT_HOME = `Impressionist/contentData`

### *movies*
- What are movies?
    - Anything that does not have a season. Even clips created from tvshow episodes should be given their individual movie folder in `CONTENT_HOME/movies/`.
- Labeling 
    - Folders inside `CONTENT_HOME/movies/` should be in title case (or atleast first letter capitalized)
- What's inside?
    - Each movie folder should contain at least 2 files
    1. `.vtt` subtitle file
    2. `.mp4` or `.mkv` video file (this will be used on front)
    - (additional) After processed, each folder should contain:
    3. `features/` folder that contains `.csv` files

### *tvShows*
- What are tvShows?
    - Anything that has multiple episodes per season or can be categorized into seasonal groups
- Labeling
    - Folders inside `CONTENT_HOME/tvShows` should be labeled as follows
    - **FIRST** level: should be title of the tvShow (*title case*)
    - **SECOND** level: should be NUMBER (denoting **season**)
    - **THIRD** level: should be NUMBER-STRING[-STRING]* (denoting **episode** and **episode title**)
- What's inside?
    - actual files will be inside the **THIRD** level folders for all tvShows
        - example: `CONTENT_HOME/tvShows/FIRST/SECOND/THIRD/file.mp4`
        - real example: `CONTENT_HOME/tvShows/Friends/02/12-The-One-After-The-Superbowl/friends_s01e12.mkv`
    - Inside each **THIRD** level folder there will be at least:
    1. `.vtt` subtitle file 
    2. `.mp4` or `.mkv` video file
    - (additional) After processed, THIRD will also contain:
    3. `features/` folder that contains `.csv` files
    
