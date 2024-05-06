"use client"

import React, { useState } from 'react';
import styles from './notifications.module.css'; 



export default function Cards() {

    const [isDisabled, setIsDisabled] = useState(true);

    return (
        <main className={styles.main}>
            <h2 className={styles.title}>Notifications</h2>
            <div className={styles.greyline}></div>
            <div className={styles.table}>
                <h2 className={styles.smalltitle}>Notification settings</h2>
                <div className={styles.checkmarkbox}>
                <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationText}></p>
                            <div className={styles.notificationControls}>
                                
                                <p className={styles.servicestext}>Mail</p>
                                <p className={styles.servicestext}>Telegram</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationText}>All notifications</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle" />
                                <label htmlFor="notifications-toggle" className={styles.checkboxLabel}></label>
                                <button className={styles.connectButton}>Connect</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationText}>General notices</p>
                            
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationTexttwo}>Log-in notification</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle"  className={styles.checkboxLabeltwo}/>
                                
                                <input type="checkbox" id="notifications-toggle"   className={styles.checkboxLabelthree} disabled={true} checked={true} />
                               
                            </div>
                            
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationTexttwo}>Ticket answer</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle"  className={styles.checkboxLabeltwo}/>
                                
                                <input type="checkbox" id="notifications-toggle"   className={styles.checkboxLabelthree} disabled={true} checked={true} />
                               
                            </div>
                            
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationText}>Team</p>
                            
                            
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationTexttwo}>Teams</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle"  className={styles.checkboxLabeltwo}/>
                                
                                <input type="checkbox" id="notifications-toggle"   className={styles.checkboxLabelthree} disabled={true} checked={true} />
                               
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            
            <div className={styles.tabletwo}>
                <h2 className={styles.smalltitle}>Default notification settings for new cards</h2>
                <div className={styles.checkmarkbox}>
                <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationText}></p>
                            <div className={styles.notificationControls}>
                                
                                <p className={styles.servicestext}>Mail</p>
                                <p className={styles.servicestext}>Telegram</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationTexttwo}>3DS codes</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle"  className={styles.checkboxLabeltwo}/>
                                
                                <input type="checkbox" id="notifications-toggle"   className={styles.checkboxLabelthree} disabled={true} checked={true} />
                               
                            </div>
                            
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationTexttwo}>Card transactions</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle"  className={styles.checkboxLabeltwo}/>
                                
                                <input type="checkbox" id="notifications-toggle"   className={styles.checkboxLabelthree} disabled={true} checked={true} />
                               
                            </div>
                            
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationTexttwo}>Card blockage</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle"  className={styles.checkboxLabeltwo}/>
                                
                                <input type="checkbox" id="notifications-toggle"   className={styles.checkboxLabelthree} disabled={true} checked={true} />
                               
                            </div>
                            
                        </div>
                    </div>
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationTexttwo}>Successfull autoreplenishment</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle"  className={styles.checkboxLabeltwo}/>
                                
                                <input type="checkbox" id="notifications-toggle"   className={styles.checkboxLabelthree} disabled={true} checked={true} />
                               
                            </div>
                            
                        </div>
                    </div>
        
                    <div className={styles.services}>
                        <div className={styles.notificationSettings}>
                            <p className={styles.notificationTexttwo}>Failed autoreplenishment</p>
                            <div className={styles.notificationControls}>
                                <input type="checkbox" id="notifications-toggle"  className={styles.checkboxLabeltwo}/>
                                
                                <input type="checkbox" id="notifications-toggle"   className={styles.checkboxLabelthree} disabled={true} checked={true} />
                               
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
