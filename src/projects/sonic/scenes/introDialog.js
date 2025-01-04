export function introDialog(k) {
    k.loadSprite('sonic', '/graphics/sonictalking.gif');
    k.loadSprite('tails', '/graphics/tails.png');
    k.loadSound('sonic_voice', '/sounds/talking.mp3' );
    // k.loadSound("tails_voice", "examples/sounds/tails_voice.wav");
    k.loadFont('mania','/fonts/mania.ttf');

    const characters = {
        'sonic': {
            'sprite': 'sonic',
            'name': 'Sonic',
            'sound': 'sonic_voice' 
        },
        'tails': {
            'sprite': 'tails',
            'name': 'Tails'
        }
    };

    const dialogs = [
        ['sonic', '[default]Oh salut[/default]'],
        ['tails', '[default]Hey! c\'est Sonic[/default]'],
        ['sonic', '[default]Comment tu vas ?[/default]'],
        ['tails', '[default]Pas bien du tout Robotnik a volé notre ciel[/default]'],
        ['sonic', '[default]ho la vache je l\'avais pas vu[/default]'],
        ['tails', '[default]oui il faut l\'arreter !![/default]'],
        ['sonic', '[default]ok tu viens avec moi tails ?[/default]'],
        ['tails', '[default]nope[/default]'],
        ['sonic', '[default]Pas sympa ...[/default]'],
        ['tails', '[default]Au cas ou sonic, certaines platformes sont traversable[/default]'],
        ['sonic', '[default]...[/default]'],
        ['tails', '[default]et déplace toi avec les touche directives de l\'ordinateur[/default]'],
        ['sonic', '[default]heuuu ok ... merci je devine[/default]'],
        ['tails', '[default]de rien, allez maintenant va attraper Robotnik \'\'qui a volé le ciel\'\'[/default]']
    ];

    let curDialog = 0;
    let isTalking = false;

    const dialogText = k.add([
        k.text('', { size: 50, font: 'mania' }),
        k.pos(k.width() / 2 - 190, k.height() - 500),
        { origin: 'left' }, 
        k.layer('ui')
    ]);

    const spriteDisplay = k.add([
        k.sprite('sonic'),
        k.pos(k.width() / 2 - 300, k.height() - 1250),
        { origin: 'center' }, 
        k.layer('ui')
    ]);

    function showDialog() {
        isTalking = true;

        const [character, text] = dialogs[curDialog];
        spriteDisplay.use(k.sprite(characters[character].sprite));
        dialogText.text = `${characters[character].name}: ${text}`;

        if (characters[character].sound) {
            k.play(characters[character].sound);
        }

        k.wait(0, () => {
            isTalking = false;
        });
    }

    showDialog();

    k.onKeyPress('space', () => {
        if (isTalking) return;

        curDialog++;
        if (curDialog >= dialogs.length) {
            k.go('mainGame');
        } else {
            showDialog();
        }
    });
}