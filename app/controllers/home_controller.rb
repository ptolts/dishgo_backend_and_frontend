class HomeController < ApplicationController

  def restaurants
    text = []
    Restaurant.all.each do |resto|
      # next unless resto.name =~ /will/i
      text << "<br/>\n\r********************<br/>\n\r"
      # resto.sources.each do |source|
      #   text << "[#{source.name}] [#{source.remote_id}] [#{source.source}]<br/>"
      #   text << "[Images]<br/>"
      #   if source.respond_to?(:images)
      #     source.images.each do |image|
      #       text << "#{image.to_json}<br/>"
      #       text << "<img src=\"#{image['local_url']}\"><br/>"
      #     end
      #   end
      #   text << "<br/>\n\r=============<br/>\n\r"
      # end
      text << "[#{resto.name}]\n<br/>"
      resto.images.each do |e|
        new_file = e['local_url'].scan(/(.*)\.(.+)/).first
        new_file = new_file[0] + "_face." + new_file[1]
        text << "<img src=\"http://dev.foodcloud.ca:3000/assets/sources/#{new_file}\"><br />"
          if e["face_found"] 
            text << "Face Found.<br/>"  
          end
          if e["text_found"] 
            text << "Text Found.<br/>"  
          end          
        new_file = e['local_url'].scan(/(.*)\.(.+)/).first
        new_file = new_file[0] + "_final." + new_file[1] 
        text << "<img src=\"http://dev.foodcloud.ca:3000/assets/sources/#{e['local_url']}\"><br />"
        new_file = e['local_url'].scan(/(.*)\.(.+)/).first
        new_file = new_file[0] + "_text." + new_file[1]
        text << "<img src=\"http://dev.foodcloud.ca:3000/assets/sources/#{new_file}\"><br />"        
        # if e["face_found"] or e["text_found"]
        #   # text << "<img src=\"http://dev.foodcloud.ca:3000/assets/sources/#{e['local_url']}\"><br />"
        #   if e["face_found"] 
        #     text << "Face Found.<br/>"
        #     new_file = e['local_url'].scan(/(.*)\.(.+)/).first
        #     new_file = new_file[0] + "_face." + new_file[1]
        #     text << "<img src=\"http://dev.foodcloud.ca:3000/assets/sources/#{new_file}\"><br />"
        #   end
        #   if e["text_found"]
        #     text << "Text Found [#{e['text_found_result']}]<br/>"
        #   end
        # end
      end
      text << "<br/>\n\r=============<br/>\n\r"
    end
    render :text => text.join("\n\r")
  end
end
