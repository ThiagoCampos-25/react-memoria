import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/thg_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemTypes';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);


  useEffect(() => resetAndCreatGrid(), []);

  useEffect(() => {
    const timer = setInterval(() =>{
      if(playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  //verificar se os abertos são iguais.
  useEffect(() => { 
    if(shownCount === 2) {
      let opened = gridItems.filter(item => item.show === true);
      if(opened.length === 2) {

        //verificalção1 - se eles sçao iguais, torna-los permanents        
        if(opened[0].item === opened[1].item){   
          let tmpGrid = [...gridItems];      
          for(let i in tmpGrid) {
            if(tmpGrid[i].show) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].show = false;
            }
          }       
          setGridItems(tmpGrid);
          setShownCount(0);

        } else {
          // verificação2 - se eles não são iguais, fechem
          setTimeout(() => {

            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].show = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000)
        }         

          setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
      setPlaying(false);
    }

  }, [moveCount, gridItems])

  const resetAndCreatGrid = () => {
    //passo 1 - resertar o jog
      setTimeElapsed(0);
      setMoveCount(0);
      setShownCount(0);

    //passo 2 - criar o grid 
    // 2.1 - criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++){  
      tmpGrid.push({
        item: null,
        show: false,
        permanentShown: false
      });
    }
    //2.2 - preencher o grid

    for(let w = 0; w < 2; w++){
      for(let i = 0; i < items.length; i++){
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null){
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }
    // 2.3 - jogar no state
    setGridItems(tmpGrid);
    //passo 3 começar o jogo
    setPlaying(true);


  } 

    const handleItemClick = (index: number) => {
      if(playing && index !== null && shownCount < 2){
        let tmpGrid = [...gridItems];
        if(tmpGrid[index].permanentShown === false && tmpGrid[index].show ===false){
          tmpGrid[index].show = true;
          setShownCount(shownCount + 1);
        }
        setGridItems(tmpGrid);
      }
    }

  return (

    <C.Container>

      <C.Info>

        <C.LogoLink href="">
          <img src={logoImage} width="200" alt=''/>
        </C.LogoLink>

      <C.InfoArea>
        <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
        <InfoItem label="Movimentos" value={moveCount.toString()} />
      </C.InfoArea>

      <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreatGrid}/>
      </C.Info>

      <C.GridArea>
      <C.Grid>
        {gridItems.map((item, index) => (

          <GridItem
            key={index}
            item={item}
            onClick={() => handleItemClick(index)}
          />
        ))}

      </C.Grid>
      </C.GridArea>

    </C.Container>
  );
}

export default App;