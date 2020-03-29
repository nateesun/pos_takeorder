import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import GridListTileBar from "@material-ui/core/GridListTileBar"
import Checkbox from "@material-ui/core/Checkbox"
import { Config } from "../../config"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)"
  },
  title: {
    color: theme.palette.primary.light
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  }
}))

export default function MenuSubList(props) {
  const classes = useStyles()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const initLoad = () => {
    console.log("initLoad")
    fetch(`${Config.API_HOST}/menu_list/${props.code}`)
      .then(res => res.json())
      .then(
        response => {
          if (response.status === "not_found") {
            setData([])
          } else {
            setData(response)
          }
          setLoading(false)
        },
        error => {
          console.log("in error found => ", error)
          setLoading(false)
        }
      )
      .catch(error => {
        console.log("Error: (MenuSubList: " + error + ")")
        setLoading(false)
      })
  }

  if (loading) {
    initLoad()
  }

  useEffect(() => {
    console.log("MenuSubList - useEffect")
    return function() {
      console.log("Menu sublist cleanup")
    }
  }, [])

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList}>
        {data.map(item => (
          <GridListTile key={item.code}>
            <img
              src={`${Config.API_HOST}/images${item.img_url}`}
              alt={item.name}
            />
            <GridListTileBar
              classes={{
                root: classes.titleBar,
                title: classes.title
              }}
              actionIcon={<Checkbox style={{ color: "white" }} />}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}
