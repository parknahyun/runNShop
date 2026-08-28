package com.runnshop

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class RunnshopApiApplication

fun main(args: Array<String>) {
    runApplication<RunnshopApiApplication>(*args)
}
