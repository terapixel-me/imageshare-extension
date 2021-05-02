import React, {ChangeEvent, Component, useEffect, useState} from "react";
import Authentication from '../../util/Authentication/Authentication'
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {Button, Checkbox, CircularProgress, FormControlLabel, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PhotoCameraRoundedIcon from "@material-ui/icons/PhotoCameraRounded"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        textAlign: 'center',
        overflowY: "scroll"
    },
    container: {
        minHeight: "100vh"
    },
    imgBox: {
        maxWidth: "70%",
        maxHeight: "70%",
        margin: "10px 15%",
        boxShadow: "inset 0 0 2pt 2pt lightgray"
    },
    img: {
        maxHeight: "inherit",
        maxWidth: "inherit",
        height: "auto",
        width: "auto"
    },
    input: {
        display: "none"
    },
    icon: {
        fontSize: "4rem"
    },
    header: {
        fontSize: "1.5rem"
    },
    checks: {
        fontSize: ".9em",
        margin: "5%",
        textAlign: "start"
    },
    send: {
        margin: "5%"
    },
    finish: {
        margin: "50px"
    }
}));

enum FormState {
    NOT_UPLOADING = 0,
    UPLOADING,
    FINISHED
};

export const UploadForm = (props : {twitch : any}) => {
    const classes = useStyles();
    const [source, setSource] = useState("");
    const [file, setFile] = useState<Blob>();
    const [state, setState] = useState({
        hasRight: false,
        privacyConsent: false,
        isSure: false,
    });

    const [uploading, setUploading] = useState(FormState.NOT_UPLOADING);

    const handleChange = (event : any) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const {hasRight, privacyConsent, isSure} = state;

    const handleCapture = (target : any) => {
        if (target.files) {
            if (target.files.length !== 0) {
                const file = target.files[0];
                setFile(file);
                const newUrl = URL.createObjectURL(file);
                setSource(newUrl);
            }
        }
    };

    const uploadImage = () => {
        setUploading(FormState.UPLOADING);
        // @ts-ignore
        window.Twitch.ext.rig.log(source);
        // @ts-ignore
        window.Twitch.ext.rig.log(state);
        const data = new FormData();

        props.twitch.rig.log(props.twitch.configuration.global)

        // @ts-ignore
        data.append('file', file);
        data.append('hasRight', state.hasRight ? "true" : "false");
        data.append('privacyConsent', state.privacyConsent ? "true" : "false");
        data.append('isSure', state.isSure ? "true" : "false");

        axios.put("http://localhost:9090/api/upload", data, {

        }).then(res => {
            console.log(res);
            setUploading(FormState.FINISHED);
        })
    };


    switch (uploading) {
        case FormState.NOT_UPLOADING:
            return (<div className={classes.root}>
                <Grid container className={classes.container}>
                    <Grid item xs={12}>
                        <h1 className={classes.header}>Capture your image</h1>
                        {source &&
                        <Box display="flex" justifyContent="center" border={0} className={classes.imgBox}>
                            <img src={source} alt={"snap"} className={classes.img}/>
                        </Box>}
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="icon-button-file"
                            type="file"
                            capture="user"
                            onChange={(e) => handleCapture(e.target)}/>
                        <label htmlFor="icon-button-file">
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span">
                                <PhotoCameraRoundedIcon fontSize="large" color="primary" className={classes.icon}/>
                            </IconButton>
                        </label>
                        {source && <Box justifyContent="left" className={classes.checks}>
                            <p>
                                <FormControlLabel
                                    control={<Checkbox checked={hasRight} onChange={handleChange}
                                                       name={"hasRight"}/>}
                                    label={"I hereby confirm that I own all necessary rights to the image " +
                                    "and grant the streamer a non-exclusive, transferable license to display it in the " +
                                    "live broadcast and any subsequent recordings."}/>
                            </p>
                            <p>
                                <FormControlLabel
                                    control={<Checkbox checked={privacyConsent} onChange={handleChange}
                                                       name={"privacyConsent"}/>}
                                    label={"I acknowledge the data-protection advice and consent to the data-processing"}/>
                            </p>
                            <p>
                                <FormControlLabel
                                    control={<Checkbox checked={isSure} onChange={handleChange} name={"isSure"}/>}
                                    label={"I'm sure to submit this image now!"}/>
                            </p>
                        </Box>}
                        {source && <Box className={classes.send}>
                            <Button variant="contained" color="primary"
                                    onClick={uploadImage}
                                    disableElevation disabled={!hasRight || !privacyConsent || !isSure}>
                                Upload
                            </Button>
                        </Box>}
                    </Grid>
                </Grid>
            </div>)
        case FormState.UPLOADING:
            return (
                <div className={classes.root}>
                    <Grid container className={classes.container}>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center" className={classes.finish}>
                                <CircularProgress />
                            </Box>
                        </Grid>
                    </Grid>
                </div>
            )
        case FormState.FINISHED:
            return (<div className={classes.root}>
                <Grid container className={classes.container}>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" className={classes.finish}>
                            <CheckCircleIcon fontSize="large" color="primary" className={classes.icon}/>
                        </Box>
                    </Grid>
                </Grid>
            </div>)
    }

}