<!DOCTYPE html>
<html>
    <head>
        <title>Krishna Paul</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style type="text/css">
        body {
    display: flex;
    flex-direction: column;
    padding: 2em;
    background-color: black;
    color: aliceblue;
    font-family: cursive;
}

a {
    color: blueviolet;
}

i {
    font-size: 2rem;
}

.pf-name {
    font-size: 10vw;
    align-self: center;
}

.pf-motto {
    background-color: rgba(138,43,226,0.2);
    padding: 0.2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    width: fit-content;
    border-radius: 1rem;
    align-self: center;
    font-size: 1rem;
}

.pf-description {align-self: center;margin: 2em;padding: 1em;font-family: monospace;font-size: 1.5em;}

.pf-social {
    align-self: center;
    display: flex;
    align-content: center;
    justify-content: center;
    padding-bottom: 1em;
    flex-wrap: wrap;
}

.pf-social-button {
    padding-left: 0.5em;
    padding-right: 0.5em;
}

.pf-services {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    margin: 2em;
}

.pf-services-item {
    text-align: center;
    display: flex;
    flex-direction: column;
}

.pf-services-item-title {
    background-color: blueviolet;
    align-self: center;
    padding: 0.5em;
    border-radius: 1.5em;
    margin-left: 0.5em;
    margin-right: 0.5em;
}

.pf-footer {
    align-items: center;
    display: flex;
    align-content: center;
    justify-content: center;
}

@media screen and (min-width: 320px) {
    .pf-services{
        flex-direction: column;
    }

    .pf-services-item {
        margin-bottom: 1em;
        margin-top: 1em;
    }
}

@media screen and (min-width: 800px) {
    .pf-services{
        flex-direction: row;
    }
    .pf-services-item {
        margin-bottom: 0em;
        margin-top: 0em;
    }
}
        </style>
        <script src="./pf.js" type="text/javascript"></script>
        <script src="https://kit.fontawesome.com/05c53cb965.js" crossorigin="anonymous"></script>
    </head>
    <body>
        <div class="pf-name">Krishna Paul</div>
        <div class="pf-motto">Learner. Creator. Thinker.</div>
        <div class="pf-description">Hello, I am a full stack developer. I create, learn and try new tech.</div>
        <div class="pf-social">
            <div class="pf-social-button">
                <a href="https://github.com/krishnapaul242/"><i class="fab fa-github"></i></a>
            </div>
            <div class="pf-social-button">
                <a href="https://www.linkedin.com/in/krishna-paul-129391148/"><i class="fab fa-linkedin"></i></a>
            </div>
            <div class="pf-social-button">
                <a href="mailto:krishnapaulmailbox@gmail.com"><i class="fas fa-envelope"></i></a>
            </div>
            <div class="pf-social-button">
                <a href="https://www.facebook.com/reachkrishnapaul/"><i class="fab fa-facebook"></i></a>
            </div>
            <div class="pf-social-button">
                <a href="https://twitter.com/the_paperknight"><i class="fab fa-twitter"></i></a>
            </div>
            <div class="pf-social-button">
                <a href="https://dev.to/krishnapaul"><i class="fab fa-dev"></i></a>
            </div>
        </div>
        <div class="pf-services">
            <div class="pf-services-title"></div>
            <div class="pf-services-item">
                <div class="pf-services-item-image"></div>
                <div class="pf-services-item-title">React.js</div>
                <div class="pf-services-item-description">Highly scalable and fast web apps in MERN stack.</div>
                <div class="pf-services-item-examples">
                    <div class="pf-services-item-example"></div>
                </div>
            </div>
            <div class="pf-services-item">
                <div class="pf-services-item-image"></div>
                <div class="pf-services-item-title">Python and Django</div>
                <div class="pf-services-item-description">Powerful and robust solutions with Python and Django.</div>
                <div class="pf-services-item-examples">
                    <div class="pf-services-item-example"></div>
                </div>
            </div>
            <div class="pf-services-item">
                <div class="pf-services-item-image"></div>
                <div class="pf-services-item-title">C# and ASP.Net</div>
                <div class="pf-services-item-description">Reliable software on enterprise architecture with C#, ASP and MS SQL Server.</div>
                <div class="pf-services-item-examples">
                    <div class="pf-services-item-example"></div>
                </div>
            </div>
            <div class="pf-services-item">
                <div class="pf-services-item-image"></div>
                <div class="pf-services-item-title">PHP</div>
                <div class="pf-services-item-description">Maintainence and upgradation of websites powered by PHP.</div>
                <div class="pf-services-item-examples">
                    <div class="pf-services-item-example"></div>
                </div>
            </div>
            <div class="pf-services-item">
                <div class="pf-services-item-image"></div>
                <div class="pf-services-item-title">Java</div>
                <div class="pf-services-item-description">Maintainence and upgradation of websites powered by Java.</div>
                <div class="pf-services-item-examples">
                    <div class="pf-services-item-example"></div>
                </div>
            </div>
            <div class="pf-services-item">
                <div class="pf-services-item-image"></div>
                <div class="pf-services-item-title">Bootstrap</div>
                <div class="pf-services-item-description">Simple, Beautiful and Static websites by Bootstrap.</div>
                <div class="pf-services-item-examples">
                    <div class="pf-services-item-example"></div>
                </div>
            </div>
        </div>
        <div class="pf-footer">
            <div class="pf-footer-text">Krishna Paul. <a href="">GNU GPL v3 License</a></div>
        </div>
    </body>
</html>
