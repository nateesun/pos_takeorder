import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import GridListTileBar from "@material-ui/core/GridListTileBar"
import IconButton from "@material-ui/core/IconButton"
import Fastfood from "@material-ui/icons/Fastfood"
import { Redirect } from "react-router"
import { Config } from "../config"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}))

export default function GetMenu(props) {
  const classes = useStyles()
  const [data, setData] = useState([])
  // const [isLoader, setIsLoader] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [selItem, setSelItem] = useState({})

  const handleOnClick = (code, group) => {
    setRedirect(true)
    setSelItem({
      code: code,
      group: group
    })
  }

  useEffect(() => {
    fetch(`${Config.API_HOST}/product/${props.id}`)
      .then(res => res.json())
      .then(
        result => {
          setData(result)
        },
        error => {
          // setIsLoader(true)
        }
      )
  }, [props.id])

  if (redirect) {
    return <Redirect push to={`/detail/${selItem.group}/${selItem.code}`} />
  }

  return (
    <div className={classes.root}>
      <GridList>
        {data.map(item => (
          <GridListTile key={item.code_key}>
            <img
              src={`${Config.API_HOST}/images${item.img_url}`}
              alt={item.description}
              onClick={() =>
                handleOnClick(`${item.code}`, `${item.group_code}`)
              }
            />
            <GridListTileBar
              title={item.name}
              subtitle={<span>Code: {item.code}</span>}
              actionIcon={
                <IconButton
                  aria-label={`info about ${item.description}`}
                  className={classes.icon}
                >
                  <Fastfood />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}