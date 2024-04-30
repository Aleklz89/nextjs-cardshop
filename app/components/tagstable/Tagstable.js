import React from 'react';
import styles from './tagstable.module.css';
import Image from 'next/image';

const Tagstable = () => {
    return (
        <div className={styles.assetsContainer}>

            <div className={styles.content}>
                <p className={styles.suggestion}>No tags found</p>
                <Image
                    src="https://i.ibb.co/dD4rhQN/emoji-sad-icon-1024x1024-t873gdf3.png"
                    alt="Description"
                    className="icon"
                    width={28}
                    height={28}

                />
            </div>
        </div>
    );
};

export default Tagstable;