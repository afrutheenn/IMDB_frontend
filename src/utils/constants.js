export const MOVIE_VALIDATION = {
    NAME_MIN: 2,
    NAME_MAX: 100,
    PLOT_MIN: 10,
    PLOT_MAX: 2000,
    YEAR_MIN: 1888,
    YEAR_MAX: new Date().getFullYear() + 5
  };
  
  export const ACTOR_VALIDATION = {
    NAME_MIN: 2,
    NAME_MAX: 100,
    BIO_MAX: 1000
  };
  
  export const PRODUCER_VALIDATION = {
    NAME_MIN: 2,
    NAME_MAX: 100,
    BIO_MAX: 1000
  };