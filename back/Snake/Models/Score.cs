using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snake.Models
{
    public class Score
    {
        public int ID { get; set; }
        public int Points { get; set; }
        public int UserID { get; set; }

        public User User { get; set; }
    }
}
