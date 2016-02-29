package com.zestlifia.controller;

import com.zestlifia.util.FileUtil;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;

/**
 * Created by jackho on 2/29/16.
 */
@Controller
public class RestCtrl {

    @RequestMapping(value = "/zestlifia/rest/{id}")
    @ResponseBody
    String rest(@PathVariable("id") String id) {

        JSONObject jsonData = FileUtil.getRest(id);

        return jsonData.toJSONString();
    }
    @RequestMapping(value = "/zestlifia/rest/{path}/{id}")
    @ResponseBody
    String restParams(@PathVariable("path") String path, @PathVariable("id") String id) {

        String fileName = path + File.separator + id ;

        JSONObject jsonData = FileUtil.getRest(fileName);

        return jsonData.toJSONString();
    }
}
