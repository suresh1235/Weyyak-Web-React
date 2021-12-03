import React from 'react';
import './index.scss';

const episodesMobileContainer = React.memo((props) => {
  return (
    <section className="series-episodes-mobile">
      {props.children}
    </section>
  );
})

export default episodesMobileContainer;