document.addEventListener('DOMContentLoaded', () => {
    const gameModeBtns = document.querySelectorAll('.game-mode-btn');
    const difficultySection = document.querySelector('.difficulty');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');

    let selectedMode = '';
    let selectedDifficulty = '';

    gameModeBtns.forEach(button => {
        button.addEventListener('click', () => {
            selectedMode = button.getAttribute('data-mode');
            if (selectedMode === 'user-vs-cpu') {
                difficultySection.classList.remove('hide');
            } else {
                window.location.href = `game.html?mode=${selectedMode}`;
            }
        });
    });

    difficultyBtns.forEach(button => {
        button.addEventListener('click', () => {
            selectedDifficulty = button.getAttribute('data-difficulty');
            window.location.href = `game.html?mode=${selectedMode}&difficulty=${selectedDifficulty}`;
        });
    });
});
